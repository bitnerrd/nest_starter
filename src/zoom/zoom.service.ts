import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import { Meetings } from 'src/entities/meetings/meetings.entity';


const ZOOM_BASE_URL = 'https://api.zoom.us/v2'

const API_KEY = process.env.Client_Id;
const ZOOM_API_SECRET = process.env.Client_Secret;
const ZOOM_TOKEN_CREDS = {
    access_token: '',
    token_type: '',
    expires_in: 0,
    created_at: 0
}


const tokenPayload = {
    iss: process.env.Zoom_API_Key, //your API KEY
    exp: new Date().getTime() + 5000,
};

const data = {
    id: '3e7OYtyUR1CPt_-jEEbZYA',
    first_name: 'user_1',
    last_name: 'test_user',
    email: 'user_1@example.com',
    type: 1
}

@Injectable()
export class ZoomService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(Meetings)
        private readonly meetingRepository: Repository<Meetings>,
    ) {
        // this.createTestUser('user_1@example.com', 'user_1', 'test_user')

        // this.createMeetings('a@a.com', 'hello', 'user')
    }

    checkIfTokenNotExpired() {
        // if (ZOOM_TOKEN_CREDS.access_token.length) {
        //     if ((Number(ZOOM_TOKEN_CREDS.created_at) + Number(ZOOM_TOKEN_CREDS.expires_in)) > new Date().getMilliseconds()) {
        //         return true
        //     }
        // }
        console.log('ZOOM_TOKEN_CREDS',ZOOM_TOKEN_CREDS)
        return false
    }

    async getAuthorizedToken() {
        try {
            if (this.checkIfTokenNotExpired()) {
                return ZOOM_TOKEN_CREDS.access_token
            }
            const base64Creds = Buffer.from(`${process.env.Client_Id}:${process.env.Client_Secret}`).toString('base64')
            const data = JSON.stringify({
                'grant_type': 'account_credentials',
                'account_id': `${process.env.Account_Id}`
            });
            const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.Account_Id}`
            const response = await axios.post(url, data, {
                headers: {
                    'Authorization': `Basic ${base64Creds}`,
                    'Content-Type': 'application/json'
                }
            })

            const responseData = response.data

            console.log('response', responseData)

            ZOOM_TOKEN_CREDS.access_token = responseData.access_token
            ZOOM_TOKEN_CREDS.token_type = responseData.token_type
            ZOOM_TOKEN_CREDS.expires_in = responseData.expires_in
            ZOOM_TOKEN_CREDS.created_at = new Date().getMilliseconds();

            return ZOOM_TOKEN_CREDS.access_token
        } catch (error) {
            console.log('error', error)
        }
    }

    async createUser(user: { email: string, first_name: string, last_name: string }) {
        try {
            const url = 'users'
            const userPayload = {
                "action": "custCreate",
                "user_info": {
                    "email": user.email,
                    "type": 1,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            }

            const response = await axios({
                method: 'post',
                url: `${ZOOM_BASE_URL}/${url}`,
                data: userPayload,
                headers: {
                    Authorization: `Bearer ${await this.getAuthorizedToken()}`
                }
            });
            this.updateUserWithZoomId(user.email, response.data.id)
            return response.data;
        } catch (error) {
            if (error?.response?.data?.code === 1005) {
                this.getThisUserFromZoom(user.email)
            }
        }
    }

    async getThisUserFromZoom(email: string) {
        const baseUrl = `https://api.zoom.us/v2/users/${email}`;

        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Zoom-Jwt-Request',
            Authorization: `Bearer ${await this.getAuthorizedToken()}`,
        };

        try {
            const response = await axios.get(baseUrl, { headers });
            this.updateUserWithZoomId(email, response.data.id)
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateUserWithZoomId(email: string, zoomUserId: string) {
        return await this.userRepository.update({ email: email }, { zoomUserId: zoomUserId })
    }

    async createTestUser(email: string, firstName: string, lastName: string) {
        const baseUrl = 'https://api.zoom.us/v2/users';
        const apiKey = API_KEY;
        const apiSecret = ZOOM_API_SECRET;

        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Zoom-Jwt-Request',
            Authorization: `Bearer ${await this.getAuthorizedToken()}`,
        };

        const data = {
            email,
            first_name: firstName,
            last_name: lastName,
            type: 1, // basic user type
        };

        const userPayload = {
            "action": "custCreate",
            "user_info": {
                "email": email,
                "type": 1,
                "first_name": firstName,
                "last_name": lastName
            }
        }

        try {
            const response = await axios.post(baseUrl, userPayload, { headers });
            console.log(response)
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private generateJWT(apiKey: string, apiSecret: string) {
        // generate JWT token here
        const payload = {
            iss: apiKey,
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration time
        };

        return jwt.sign(payload, apiSecret, { algorithm: 'HS256' });
    }

    async createMeetings(payload: { organizerZoomUserId: string, participantZoomUserId: string, meetingAgenda: string }) {
        const baseUrl = `https://api.zoom.us/v2/users/${payload.organizerZoomUserId}/meetings`;

        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Zoom-Jwt-Request',
            Authorization: `Bearer ${await this.getAuthorizedToken()}`,
        };

        const data = {
            topic: payload.meetingAgenda,
            type: 2,
            start_time: "2021-03-18T17:00:00",
            duration: 20,
            password: "1234567",
            agenda: payload.meetingAgenda,
            settings: {
                // alternative_hosts: `${payload?.participantZoomUserId ? payload.participantZoomUserId : ''};`, // A semicolon-separated list of the meeting's alternative hosts' email addresses or IDs.
                host_video: true,
                participant_video: true,
                cn_meeting: false,
                in_meeting: true,
                join_before_host: true,
                mute_upon_entry: true,
                watermark: false,
                use_pmi: false,
                approval_type: 2,
                audio: "both",
                auto_recording: "local",
                enforce_login: false,
                registrants_email_notification: false,
                waiting_room: false,
                allow_multiple_devices: true
            }
        }

        try {
            const response = await axios.post(baseUrl, data, { headers });
            console.log(response.data)
            // const zoomMeeting = response.data

            // await this.meetingRepository.update({ id: payload.meeting.id }, {
            //     zoomMeetingId: zoomMeeting.id,
            //     zoomMeetingHost: payload.organizerZoomUserId,
            //     participantJoinMeetingUrl: zoomMeeting.join_url,
            //     organizerStartMeetingUrl: zoomMeeting.start_url
            // })
            return response.data;
        } catch (error) {
            console.error(error);
            throw error?.response.data ? error?.response?.data : error
        }
    }

    async addMeetingRegistrant(meeting_id: string) {
        const baseUrl = `https://api.zoom.us/v2/meetings/${meeting_id}/registrants`;

        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Zoom-Jwt-Request',
            Authorization: `Bearer ${await this.getAuthorizedToken()}`,
        };

        const data = {
            "first_name": "Usama",
            "last_name": "Akram",
            "email": "m.u.akram1997@gmail.com",
        }

        try {
            const response = await axios.post(baseUrl, data, { headers });
            console.log(response)
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteMeeting(meeting_id: string) {
        const baseUrl = `https://api.zoom.us/v2/meetings/${meeting_id}`;

        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Zoom-Jwt-Request',
            Authorization: `Bearer ${await this.getAuthorizedToken()}`,
        };

        try {
            const response = await axios.delete(baseUrl, { headers });
            console.log(response)
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
