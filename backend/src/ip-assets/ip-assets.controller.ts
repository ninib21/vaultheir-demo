import { Controller, Get, Post, Body, Param, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IPAssetsService } from './ip-assets.service';

@Controller('ip-assets')
export class IPAssetsController {
  constructor(private readonly ipAssetsService: IPAssetsService) {}

  @Post()
  async create(@Body() createDto: Partial<any>) {
    return this.ipAssetsService.create(createDto);
  }

  @Get()
  async findAll(@Query('userId') userId: string) {
    return this.ipAssetsService.findAll(userId || 'demo-user');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ipAssetsService.findOne(id);
  }

  @Post(':id/notarize')
  @UseInterceptors(FileInterceptor('file'))
  async notarize(
    @Param('id') id: string,
    @Body() body: { content?: string },
    @UploadedFile() file?: Express.Multer.File
  ) {
    let content: string;
    
    if (file) {
      // Convert file to string (for demo purposes)
      content = file.originalname + ' - ' + file.size + ' bytes';
    } else if (body.content) {
      content = body.content;
    } else {
      throw new BadRequestException('Either file or content must be provided');
    }

    return this.ipAssetsService.notarize(id, content);
  }

  @Post(':id/metadata')
  async addMetadata(@Param('id') id: string, @Body() metadata: Record<string, any>) {
    return this.ipAssetsService.addMetadata(id, metadata);
  }
}

