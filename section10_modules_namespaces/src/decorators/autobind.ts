namespace App {
  // autobind decorator
  export function Autobind(_target: any, _methodName: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const boundMethod: PropertyDescriptor = {
      configurable: true,
      get() {
        return originalMethod.bind(this);
      },
    };
    return boundMethod;
  }
}
