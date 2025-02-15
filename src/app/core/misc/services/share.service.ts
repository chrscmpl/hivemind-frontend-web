import { Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  public constructor(private readonly alerts: TuiAlertService) {}

  public async share(
    data: ShareData & { url: string; urlCopiedToClipboardMessage?: string },
  ): Promise<void> {
    if (navigator.share) {
      navigator.share(data);
    } else {
      this.copyToClipboard(data.url, data.urlCopiedToClipboardMessage);
    }
  }

  private async copyToClipboard(
    url: string,
    urlCopiedToClipboardMessage?: string,
  ): Promise<void> {
    return navigator.clipboard.writeText(url).then(() => {
      this.alerts
        .open(urlCopiedToClipboardMessage ?? 'Link copied to clipboard')
        .pipe(take(1))
        .subscribe();
    });
  }
}
