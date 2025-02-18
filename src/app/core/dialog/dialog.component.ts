import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  runInInjectionContext,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tuiDialog } from '@taiga-ui/core';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { concatWith, Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  private dialog!: (data: void) => Observable<void>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly injector: Injector,
  ) {}

  public ngOnInit(): void {
    let label: string | undefined = undefined;
    let route = this.route;
    while (route) {
      label = route.snapshot?.data?.['dialogLabel'] ?? label;
      route = route.children[0];
    }

    runInInjectionContext(this.injector, () => {
      this.dialog = tuiDialog(DialogContentComponent, {
        label,
      });
      this.subscription = this.dialog()
        .pipe(concatWith(timer(500)))
        .subscribe({
          complete: () => this.onClose(),
        });
    });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private onClose(): void {
    this.router.navigate([{ outlets: { modal: null } }], {
      queryParamsHandling: 'merge',
    });
  }
}
