import { Container, interfaces } from "inversify";

const { getBindingDictionary } = require("inversify/lib/planning/planner");

export function merge(
  container1: interfaces.Container,
  container2: interfaces.Container,
  options?: interfaces.ContainerOptions
): interfaces.Container {
  const container = new Container(options);
  const bindingDictionary: interfaces.Lookup<interfaces.Binding<
    any
  >> = getBindingDictionary(container);
  const bindingDictionary1: interfaces.Lookup<interfaces.Binding<
    any
  >> = getBindingDictionary(container1);
  const bindingDictionary2: interfaces.Lookup<interfaces.Binding<
    any
  >> = getBindingDictionary(container2);

  function copyDictionary(
    origin: interfaces.Lookup<interfaces.Binding<any>>,
    destination: interfaces.Lookup<interfaces.Binding<any>>
  ) {
    origin.traverse((key, value) => {
      value.forEach((binding) => {
        destination.add(binding.serviceIdentifier, binding.clone());
      });
    });
  }

  copyDictionary(bindingDictionary1, bindingDictionary);
  copyDictionary(bindingDictionary2, bindingDictionary);

  return container;
}
