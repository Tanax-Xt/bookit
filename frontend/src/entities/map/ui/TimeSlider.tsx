import { Slider, SliderGetValueLabelParams } from "@kobalte/core/slider";
import { createEffect, createSignal } from "solid-js";

import { formatTime } from "@/shared/lib/date";

export type TimeSliderProps = {
  step: number;
  maxRange: number;
  defaultValues: number[];
  minStepsBetweenThumbs: number;
  onChange: (values: number[]) => void;
};

const MIN_VALUE = 7 * 60 * 60;
const MAX_VALUE = 23 * 60 * 60;

export const TimeSlider = (props: TimeSliderProps) => {
  const [values, setValues] = createSignal<number[]>(props.defaultValues);
  const [prevValues, setPrevValues] = createSignal<number[]>(props.defaultValues);

  const handleChange = (newValues: number[]) => {
    const [minValue, maxValue] = newValues as [number, number];
    const [prevMinValue, prevMaxValue] = prevValues();

    if (maxValue - minValue < props.minStepsBetweenThumbs * props.step) {
      return;
    }

    if (maxValue - minValue <= props.maxRange && minValue >= MIN_VALUE && maxValue <= MAX_VALUE) {
      setPrevValues(newValues);
      setValues(newValues);
    } else {
      if (minValue !== prevMinValue) {
        const newMaxValue = Math.min(minValue + props.maxRange, MAX_VALUE);
        setValues([minValue, newMaxValue]);
        setPrevValues([minValue, newMaxValue]);
      } else if (maxValue !== prevMaxValue) {
        const newMinValue = Math.max(maxValue - props.maxRange, MIN_VALUE);
        setValues([newMinValue, maxValue]);
        setPrevValues([newMinValue, maxValue]);
      }
    }
  };

  const getValueLabel = (params: SliderGetValueLabelParams) => {
    const minValue = params.values[0] ? formatTime(params.values[0]) : "00:00";
    const maxValue = params.values[1] ? formatTime(params.values[1]) : "00:00";
    return `${minValue} – ${maxValue}`;
  };

  createEffect(() => {
    props.onChange(values());
  });

  return (
    <Slider
      step={props.step}
      value={values()}
      onChange={handleChange}
      minValue={MIN_VALUE}
      maxValue={MAX_VALUE}
      defaultValue={props.defaultValues}
      getValueLabel={getValueLabel}
      class="relative flex w-full touch-none flex-col items-center select-none"
    >
      <div class="mb-2 flex w-full justify-between">
        <Slider.Label class="text font-semibold">Время</Slider.Label>
        <Slider.ValueLabel class="text font-semibold" />
      </div>
      <Slider.Track class="relative h-1.5 w-full rounded-sm bg-bg-secondary">
        <Slider.Fill class="absolute h-full rounded-sm bg-bg-accent" />
        <Slider.Thumb class="-top-2.5 block size-6 rounded-full bg-light shadow-sm shadow-black/25 transition outline-none hover:shadow-black/50 focus-visible:shadow-black/50">
          <Slider.Input />
        </Slider.Thumb>
        <Slider.Thumb class="-top-2.5 block size-6 rounded-full bg-light shadow-sm shadow-black/25 transition outline-none hover:shadow-black/50 focus-visible:shadow-black/50">
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider>
  );
};
