import { Pipe, type PipeTransform } from "@angular/core";
import type { Review } from "@/app/core/services/review.service";

/**
 * Rating Pipe - Provides rating-related calculations
 *
 * Usage:
 * {{ reviews | rating:'average' }}
 * {{ reviews | rating:'count':5 }}
 * {{ reviews | rating:'percentage':4 }}
 */
@Pipe({
  name: "rating",
  standalone: true,
})
export class RatingPipe implements PipeTransform {
  transform(reviews: Review[], type: "average" | "count" | "percentage", ratingValue?: number): number {
    if (!reviews || reviews.length === 0) {
      return 0;
    }

    switch (type) {
      case "average":
        return this.calculateAverage(reviews);

      case "count":
        if (ratingValue === undefined) {
          throw new Error("Rating value is required for 'count' type");
        }
        return this.getRatingCount(reviews, ratingValue);

      case "percentage":
        if (ratingValue === undefined) {
          throw new Error("Rating value is required for 'percentage' type");
        }
        return this.getRatingPercentage(reviews, ratingValue);

      default:
        return 0;
    }
  }

  /**
   * Calculate average rating
   */
  private calculateAverage(reviews: Review[]): number {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  /**
   * Get count of reviews with specific rating
   */
  private getRatingCount(reviews: Review[], rating: number): number {
    return reviews.filter((r) => r.rating === rating).length;
  }

  /**
   * Get percentage of reviews with specific rating
   */
  private getRatingPercentage(reviews: Review[], rating: number): number {
    const count = this.getRatingCount(reviews, rating);
    return Math.round((count / reviews.length) * 100);
  }
}
