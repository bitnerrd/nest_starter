import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Buffer } from "buffer";
import * as moment from "moment";
import { Model } from "mongoose";
import { sendEmail } from "src/common/services/googleapis";
import { stripeServicesInstance } from "src/common/services/stripe";
import { signUpEmailTemplateHTML } from "src/common/utils/emailTemplate";
import { jwt } from "src/common/utils/jwt";
import { OTP } from "src/common/utils/otp";
import { v4 as uuidv4 } from "uuid";
import { Payment } from "../stripe/stripe.model";
import { ChangePasswordDTO } from "../user/user.dto";
import {
  AUTHPROVIDER,
  ForgetPasswordDTO,
  LoginDTO,
  ResendOtpDTO,
  ResetPasswordDTO,
  SignupDTO,
  resetType,
} from "./auth.dto";
import { FailedLogins, Login } from "./login.model";
import { User } from "src/api/user/models/user.model";
import { IUser } from "src/common/interfaces/user.interface";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Login.name) public Login: Model<Login>,
    @InjectModel(Payment.name) public Payment: Model<Payment>,
    @InjectModel(User.name) public User: Model<User>
  ) {}

  async login(payload: LoginDTO) {
    const { email, password, provider, imageUrl } = payload;
    const regexEmail = email.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");

    // Find user by email with case insensitive match
    let user: any = await this.Login.findOne({
      email: { $regex: regexEmail, $options: "i" },
    });

    if (!user) {
      throw new ConflictException("User not found!", {
        cause: {
          email: "User not found with this email!",
        },
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      await this.handleFailedLogin(user);
      throw new ConflictException("Invalid Password!", {
        cause: {
          password: "Invalid Password!",
        },
      });
    }

    if (user.isLocked && user.lockUntil > moment().toDate()) {
      throw new ForbiddenException("Account Locked, try again later!");
    }

    if (!user.verified) {
      throw new NotAcceptableException("Please verify your account first!");
    }

    if (user.isLocked && user.lockUntil < moment().toDate()) {
      await this.resetAttempts(user);
    }

    // Generate JWT tokens
    const token = await jwt.generateAccessToken(user._id, "72h");
    const refreshToken = await jwt.generateRefreshToken(user, "60d");

    // Manage access tokens
    if (user.accessTokens.length >= 2) {
      await this.Login.findByIdAndUpdate(user._id, {
        $set: { accessTokens: [token], refreshToken: refreshToken },
      });
    } else {
      await this.Login.findByIdAndUpdate(user._id, {
        $push: { accessTokens: token },
        $set: { refreshToken: refreshToken },
      });
    }

    await this.resetAttempts(user);

    const profile = await this.User.findById(user.userId);

    const response = { ...user.toJSON(), ...profile.toJSON() };

    return {
      ...response,
      token: token,
      ApiMessage: "LoggedIn Successfully",
      status: HttpStatus.OK,
    };
  }

  async logoutSession(user, token: string) {
    const accessTokens = user.accessTokens;

    if (!accessTokens.includes(token)) {
      throw new UnauthorizedException("Session is already logged out");
    }

    const logout = await this.Login.findByIdAndUpdate(user._id, {
      $pull: {
        accessTokens: token,
      },
    });

    return {
      ApiMessage: "Logout Successfully",
      status: HttpStatus.OK,
    };
  }

  // ? LOGIN
  async handleFailedLogin(user: any) {
    if (user.attempts + 1 >= FailedLogins.MAX_ATTEMPTS && !user.isLocked) {
      await this.lockUser(user);
    } else if (user.isLocked && user.lockUntil < moment().toDate()) {
      await this.resetAttempts(user);
      await this.Login.updateOne({ _id: user._id }, { $inc: { attempts: 1 } });
    } else {
      await this.Login.updateOne({ _id: user._id }, { $inc: { attempts: 1 } });
    }
  }

  async lockUser(user: any) {
    const updates = {
      $set: {
        lockUntil: moment().add(5, "minute").toDate(),
        isLocked: true,
      },
    };
    await this.Login.updateOne({ _id: user._id }, updates);
  }

  async resetAttempts(user: any) {
    const updates = {
      $set: {
        isLocked: false,
        attempts: 0,
      },
      $unset: {
        lockUntil: "",
      },
    };
    await this.Login.updateOne({ _id: user._id }, updates);
  }

  async signup(payload: SignupDTO) {
    let existingUser = await this.Login.findOne({ email: payload.email });

    if (existingUser) {
      throw new ConflictException("User already exist with this email", {
        cause: { email: "User already exist with this email" },
      });
    }

    const phoneExists = await this.User.findOne({ phone: payload.phone });
    if (phoneExists) {
      throw new ConflictException("Phone number already exists", {
        cause: { phone: "User already exists with this phone" },
      });
    }

    // Register new user
    const session = await this.Login.startSession();
    session.startTransaction();

    try {
      // create customer on stripe
      let customer;
      try {
        customer = await stripeServicesInstance.createStripeCustomer(
          payload.firstName + " " + payload.lastName,
          payload.email
        );
      } catch (error) {
        throw new Error(error.message);
      }

      // Create a new user instance with the loginId from the saved login data
      const newUser = new this.User({
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        email: payload.email,
        role: "user",
        profilePicture:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        coverPicture: "",
        country: "US",
        timezone: "GMT",
        dateFormat: "MM/DD/YYYY",
        language: "EN",
      });

      // Save the user instance and handle potential failure
      const userData = await newUser.save({ session });
      if (!userData) {
        throw new Error("Failed to save user data.");
      }

      // Create a new login instance
      const newLogin = new this.Login({
        userId: userData._id,
        email: payload.email,
        password: payload.password,
        provider: AUTHPROVIDER.EMAIL,
      });

      newLogin.stripeCustomerId = customer._id;

      // Save the login instance and handle potential failure
      const loginData = await newLogin.save({ session });
      if (!loginData) {
        throw new Error("Failed to save login data.");
      }

      try {
        const payment = new this.Payment({
          userId: userData._id,
          stripeCustomerId: customer.id,
        });
        await payment.save({ session });
      } catch (error) {
        // Handle the error accordingly, e.g., by throwing a custom error or returning a response
        throw new Error(error.message || "Failed to save payment");
      }

      await session.commitTransaction();
      session.endSession();

      // generating link for email verification
      const encodedLink = await this.generateLink(loginData);

      const html = await signUpEmailTemplateHTML({
        email: payload.email,
        link: encodedLink,
      });

      await sendEmail({
        to: payload.email,
        subject: "Welcome to the TraderMetrix!",
        body: html,
      });

      return {
        encodedLink,
        ApiMessage: "Signup Successful",
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      console.error("Registration error:", error.message);
      throw new InternalServerErrorException(
        "An error occurred during the user registration process. Please try again."
      );
    }
  }

  async resendVerificationLink(email: string) {
    const user = await this.Login.findOne({ email: email });
    if (!user) {
      throw new NotFoundException("There is no account exist with this email");
    }
    if (user.verified) {
      throw new ConflictException("User already verified");
    }
    const link = await this.generateLink(user);
    const html = await signUpEmailTemplateHTML({
      email: email,
      link: link,
    });
    await sendEmail({
      to: email,
      subject: "TraderMetrix - Email Verification Link",
      body: html,
    });
    return {
      ApiMessage: "Verification Link has been sent to your email",
      status: HttpStatus.OK,
    };
  }

  async userVerified(encodedString: string) {
    const decodedString = Buffer.from(encodedString, "base64").toString(
      "ascii"
    );

    const [email, token] = decodedString.split(":");

    const user: any = await this.Login.findOne({ email: email });

    if (!user) {
      throw new NotFoundException("User not found!");
    }

    if (user.verified) {
      // throw new ConflictException("User already verified");
      return {
        ApiMessage: "User already verified",
        status: HttpStatus.CONFLICT,
      };
    }

    if (user.verifyTokenExpires < Date.now()) {
      throw new BadRequestException("Link is expired!");
    }

    if (user.verifyToken !== token) {
      throw new BadRequestException("Invalid Link!");
    }

    try {
      const newUser = await this.Login.findOneAndUpdate(
        { email: email },
        { verified: true, verifyToken: null, verifyTokenExpires: null },
        { new: true }
      );

      if (!newUser) {
        throw new InternalServerErrorException("An error occurred!");
      }

      return {
        ApiMessage: "User verified successfully",
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async passwordUpdate({
    user,
    payload,
  }: {
    user: { _id: any; email: string };
    payload: ChangePasswordDTO;
  }) {
    const data: any = await this.Login.findById(user._id);
    if (!data) {
      throw new NotFoundException("User not found");
    }
    if (payload.newPassword !== payload.confirmNewPassword) {
      throw new ConflictException("Password does not match");
    }
    const isValid = await bcrypt.compare(
      payload.currentPassword,
      data.password
    );
    if (!isValid) {
      throw new ConflictException("Invalid current password", {
        cause: { currentPassword: "Invalid current password" },
      });
    }
    data.password = payload.confirmNewPassword;
    data.save();
    return {
      ApiMessage: "Password Updated Successfully",
      status: HttpStatus.OK,
    };
  }

  async forgetPassword(payload: ForgetPasswordDTO, type: string) {
    const user = await this.Login.findOne({ email: payload.email });
    if (!user) {
      throw new ConflictException("User not found with this email", {
        cause: {
          email: "User not found with this email",
        },
      });
    }
    if (type == resetType.otp) {
      const otp = await this.generateOtp(user);

      // generating an otp email to user email
      const html = await signUpEmailTemplateHTML({
        email: payload.email,
        otp: otp,
      });

      // sending an otp email to user email
      await sendEmail({
        to: payload.email,
        subject: "Welcome to the TraderMetrix!",
        body: html,
      });

      return {
        otp,
        ApiMessage: "OTP has been sent to your email",
        status: HttpStatus.OK,
      };
    }

    const link = await this.generateLink(user);
    return {
      link,
      ApiMessage: "Link has been sent to your email",
      status: HttpStatus.OK,
    };
  }

  async verifyLink(encodedString: string) {
    const decodedString = Buffer.from(encodedString, "base64").toString(
      "ascii"
    );
    const [email, token] = decodedString.split(":");
    const user = await this.Login.findOne({
      email: email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new BadRequestException("Link is invalid or expired!");
    }
    return {
      ApiMessage: "Validtion Passed!",
      status: HttpStatus.OK,
    };
  }

  async resetPassword(payload: ResetPasswordDTO) {
    // const decodedString = Buffer.from(payload.encodedString, "base64").toString(
    //   "ascii"
    // );
    // const [email, token] = decodedString.split(":");
    const [email, password] = [payload.email, payload.password];
    const user = await this.Login.findOne({
      email,
    });
    if (!user) {
      throw new NotFoundException("User not found!");
    }

    user.password = payload.password;
    await user.save();
    await this.Login.findByIdAndUpdate(user._id, {
      resetPasswordToken: null,
      resetPasswordExpires: null,
      $set: {
        accessTokens: [], // Clear the accessTokens array
        refreshToken: null, // Clear the refreshToken field
      },
    });
    return {
      ApiMessage: "Password has been reset successfully",
      status: HttpStatus.OK,
    };
  }

  async resendOTP(payload: ResendOtpDTO, type: string) {
    // send otp via email
    const user = await this.Login.findOne({
      email: payload.email,
    });
    if (!user) {
      throw new NotFoundException("User not found!");
    }
    if (type == resetType.otp) {
      const otp = await this.generateOtp(user);

      // generating an otp email to user email
      const html = await signUpEmailTemplateHTML({
        email: payload.email,
        otp: otp,
      });

      // sending an otp email to user email
      await sendEmail({
        to: payload.email,
        subject: "Welcome to the TraderMetrix!",
        body: html,
      });

      return {
        otp,
        ApiMessage: "OTP has been sent to your email",
        status: HttpStatus.OK,
      };
    } else {
      const link = await this.generateLink(user);
      return {
        link,
        ApiMessage: "Link has been sent to your email",
        status: HttpStatus.OK,
      };
    }
  }

  async verifyPasswordResetOTP({ email, otp }: { email: string; otp: string }) {
    const user = await this.Login.findOne({
      email: email,
    });

    if (!user) {
      throw new NotFoundException("User not found!");
    }

    if (Number(user.otp) !== Number(otp)) {
      throw new BadRequestException("Invalid OTP!");
    }

    await this.Login.updateOne(
      { _id: user._id },
      {
        $unset: {
          otp: "",
        },
      },
      {
        new: true,
      }
    );
    return {
      ApiMessage: "User Verified Successfully",
      status: HttpStatus.OK,
    };
  }

  async getUserByToken(token: any) {
    const data = await jwt.verifyAccessToken({
      token: token,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });

    const user: IUser = await this.Login.findById(data._id)
      .populate("profile")
      .lean();
    // Fetching user from db after decoding token which returns user id
    return user;
  }

  // ? Function that generate OTP and update OTP in Login Model

  async generateOtp(user: any) {
    let otp = OTP(4);
    await this.Login.findByIdAndUpdate(user._id, {
      otp: otp,
      resetPasswordExpires: Date.now() + 3600000,
    });
    return otp;
    // afer integration of email or message serive we can send message to user here as its request for generating otp
  }

  async generateLink(user: any) {
    const token = uuidv4(); // generate a unique token
    const data = await this.Login.findOneAndUpdate(
      { _id: user._id },
      {
        verifyToken: token,
        verifyTokenExpires: Date.now() + 3600000, // token expires after 1 hour
      },
      { new: true }
    );
    const encodedString = Buffer.from(`${data.email}:${token}`).toString(
      "base64"
    );
    const link = `https://tradermetrix.cipherdevelopers.com/auth/verify-link/${encodedString}`;
    return link;
  }
}
