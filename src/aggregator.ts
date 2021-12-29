import { AggregatorUpdated } from "../generated/Aggregator/AggregatorContract";
import { Aggregator } from "../generated/schema";

function saveAggregator(input: string, output: string): void {
  var agg = Aggregator.load(input);
  if (agg == null) {
    agg = new Aggregator(input);
    agg.outputs = [];
    agg.input = input;
  }
  let outputs = agg.outputs;
  if (!outputs.includes(output)) {
    outputs.push(output);
    agg.outputs = outputs;
  }
  agg.save();
}

/**
 * Handle a AggregatorUpdated event
 */
export function handleAggregatorUpdated(event: AggregatorUpdated): void {
  var input = event.params._input.toHex();
  var output = event.params._output.toHex();
  saveAggregator(input, output);
  saveAggregator(output, input);
}
