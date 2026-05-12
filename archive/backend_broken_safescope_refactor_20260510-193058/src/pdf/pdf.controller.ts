import { Controller, Get, Param, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { ReportsService } from '../reports/reports.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly reportsService: ReportsService,
  ) {}

  @Get(':id')
  async generate(@Param('id') id: string, @Res() res: Response) {
    const report = await this.reportsService.findOne(id);

    const pdf = await this.pdfService.generate(report);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=inspection-report.pdf`,
      'Content-Length': pdf.length,
    });

    res.end(pdf);
  }
}
