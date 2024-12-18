import { AccessToken } from './src/auth/dtos/token';

export {};

declare global {
  namespace files {
    type FileType = 's3' | 'local' | 'firebase';
    type VoidStorageEngineConfig = () => any;
  }

  namespace Express {
    interface User extends AccessToken {
      iat: number;
      exp: number;
      sub: string;
    }

    namespace Multer {
      interface File {
        location?: string;
        publicUrl?: string;
        fileRef?: any;
      }
    }
  }
}


