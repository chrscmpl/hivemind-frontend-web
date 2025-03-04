import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { ThrottledWheelDirective } from '@app/shared/directives/throttled-wheel.directive';
import { IdeaAgeEnum } from '@app/shared/enums/idea-age.enum';
import { MATH } from '@app/shared/tokens/math.token';
import {
  TuiAppearance,
  TuiAppearanceOptions,
  TuiButton,
  TuiDataList,
  TuiDropdown,
} from '@taiga-ui/core';
import { TuiChevron, TuiDataListDropdownManager } from '@taiga-ui/kit';

interface AgeSelectorOption {
  label: string;
  value: IdeaAgeEnum;
}

@Component({
  selector: 'app-age-selector',
  imports: [
    ReactiveFormsModule,
    TuiDataList,
    TuiDataListDropdownManager,
    TuiButton,
    TuiAppearance,
    TuiChevron,
    TuiDropdown,
    ThrottledWheelDirective,
  ],
  templateUrl: './age-selector.component.html',
  styleUrl: './age-selector.component.scss',
})
export class AgeSelectorComponent implements OnInit {
  @Input() buttonAppearance: TuiAppearanceOptions['appearance'] = 'primary';
  @Output() public ageChange = new EventEmitter<IdeaAgeEnum>();

  private _currentAgeLabel!: string;
  public open: boolean = false;

  public readonly options: AgeSelectorOption[] = [
    { label: 'Last Hour', value: IdeaAgeEnum.ONE_HOUR },
    { label: 'Last Day', value: IdeaAgeEnum.ONE_DAY },
    { label: 'Last Week', value: IdeaAgeEnum.ONE_WEEK },
    { label: 'Last Month', value: IdeaAgeEnum.ONE_MONTH },
    { label: 'Last Year', value: IdeaAgeEnum.ONE_YEAR },
    { label: 'All Time', value: IdeaAgeEnum.ALL_TIME },
  ];

  public constructor(
    public readonly control: NgControl,
    @Inject(MATH) private readonly math: Math,
  ) {}

  public ngOnInit(): void {
    const value = this.control.control?.value;
    this._currentAgeLabel =
      this.options.find((option) => option.value === value)?.label ?? '';
    if (!this._currentAgeLabel) {
      throw new Error('Invalid age value');
    }
  }

  public get currentAgeLabel(): string {
    return this._currentAgeLabel;
  }

  public setOption(option: AgeSelectorOption) {
    this.control.control?.setValue(option.value);

    if (this._currentAgeLabel !== option.label) {
      this.ageChange.emit(option.value);
    }

    this._currentAgeLabel = option.label;
    this.open = false;
  }

  public onWheel(e: WheelEvent): void {
    if (this.math.abs(e.deltaY) < 2) {
      return;
    }

    const currentIndex = this.options.findIndex(
      (option) => option.value === this.control.control?.value,
    );

    if (e.deltaY > 0) {
      this.setOption(this.options[(currentIndex + 1) % this.options.length]);
    } else {
      this.setOption(
        this.options[
          (currentIndex - 1 + this.options.length) % this.options.length
        ],
      );
    }
  }
}
