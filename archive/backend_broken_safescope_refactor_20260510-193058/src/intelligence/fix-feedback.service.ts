import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FixFeedback } from './fix-feedback.entity';

@Injectable()
export class FixFeedbackService {
  constructor(
    @InjectRepository(FixFeedback)
    private feedbackRepo: Repository<FixFeedback>,
  ) {}

  async recordFeedback(data: Partial<FixFeedback>): Promise<FixFeedback> {
    const feedback = this.feedbackRepo.create(data);
    return await this.feedbackRepo.save(feedback);
  }

  async findLearnedFix(category: string): Promise<string[]> {
    const normalizedCategory = category.toLowerCase().trim();

    // 1. Fetch approved feedback for this category
    const entries = await this.feedbackRepo.find({
      where: { category: normalizedCategory, approved: true },
    });

    if (entries.length === 0) return [];

    // 2. Group by userAction.title and count frequency
    const frequencyMap: Record<string, number> = {};
    entries.forEach((entry) => {
      const title = entry.userAction?.title;
      if (title) {
        frequencyMap[title] = (frequencyMap[title] || 0) + 1;
      }
    });

    // 3. Filter by frequency >= 2 and sort by frequency descending
    const learnedFixes = Object.entries(frequencyMap)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([title]) => title)
      .slice(0, 3); // Top 3

    return learnedFixes;
  }
}
