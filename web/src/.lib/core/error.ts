import { App } from "./app/app";

export class Error {
  public constructor(private app: App, public message: string) {
    this.app.state.dispatch(this.app.state.reducers.errors.append(this));
  }
}
