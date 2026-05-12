import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post('logo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/logos',
        filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `logo-${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadLogo(@UploadedFile() file: Express.Multer.File) {
    return {
      path: `/uploads/logos/${file.filename}`,
    };
  }
}
