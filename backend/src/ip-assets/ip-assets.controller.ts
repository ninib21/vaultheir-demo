import { Controller, Get, Post, Body, Param, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IPAssetsService, CreateIPAssetDto, SearchFilters } from './ip-assets.service';

@Controller('ip-assets')
export class IPAssetsController {
  constructor(private readonly ipAssetsService: IPAssetsService) {}

  @Post()
  async create(@Body() createDto: CreateIPAssetDto) {
    return this.ipAssetsService.create(createDto);
  }

  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: SearchFilters = {
      userId: userId || 'demo-user',
      type,
      status,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    };
    return this.ipAssetsService.findAll(filters);
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

