import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExecutiveService } from './executive.service';
import { PdfService } from '../pdf/pdf.service';

@Controller('reports')
export class ExecutiveController {
  constructor(
    private readonly service: ExecutiveService,
    private readonly pdf: PdfService,
  ) {}

  @Get(':id/executive-summary')
  getExecutiveSummary(@Param('id') id: string) {
    return this.service.generateExecutiveSummary(id);
  }

  @Get(':id/executive-summary/pdf')
  async getExecutivePdf(@Param('id') id: string, @Res() res: Response) {
    const data = await this.service.generateExecutiveSummary(id);
    const pdfBuffer = await this.pdf.generateExecutivePdf(data);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=report-${id}.pdf`,
    });

    return res.send(pdfBuffer);
  }
}
