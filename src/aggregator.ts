import { Address, log, store } from "@graphprotocol/graph-ts";
import { AggregatorUpdated } from "../generated/Aggregator/AggregatorContract";
import { Aggregator } from "../generated/schema";

function saveAggregator(input: string, output: string): void {
  log.info("save {} {}", [input, output]);
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

function removeAggregator(input: string, output: string): void {
  var agg = Aggregator.load(input);
  log.info("remove {} => {}", [input, output]);
  if (agg) {
    let outputs: string[] = [];
    for (var i = 0; i < agg.outputs.length; i++) {
      if (agg.outputs[i].localeCompare(output) !== 0) {
        outputs.push(agg.outputs[i]);
      }
    }
    if (outputs.length === 0) {
      log.info("removing {}", [input]);
      store.remove("Aggregator", input);
    } else {
      log.info("keeping {} with {} outputs", [
        input,
        outputs.length.toString()
      ]);
      agg.outputs = outputs;
      agg.save();
    }
  }
}

/**
 * Handle a AggregatorUpdated event
 */
export function handleAggregatorUpdated(event: AggregatorUpdated): void {
  var input = event.params._input.toHex();
  var output = event.params._output.toHex();
  if (event.params._aggregator.equals(Address.zero())) {
    removeAggregator(input, output);
    removeAggregator(output, input);
  } else {
    saveAggregator(input, output);
    saveAggregator(output, input);
  }
}
