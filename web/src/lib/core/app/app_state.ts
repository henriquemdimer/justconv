import { Conversion } from "../conversion";
import { Error } from "../error";
import { Server } from "../server";
import { State } from "../state/state";
import { FormatsGroup } from "../types/formats";
import { Toast } from "../ui/toast";

export interface IQueueState {
    queue: Map<string, Conversion>;
}

export class QueueState extends State<IQueueState> {
    private queue: Map<string, Conversion> = new Map();

    public get data() {
        return {
            queue: this.queue
        }
    }

    public set(conv: Conversion) {
        this.queue.set(conv.id, conv);
        return this;
    }

    public sync(old_id: string, conv: Conversion) {
        this.queue.delete(old_id);
        this.queue.set(conv.id, conv);
        return this;
    }

    public remove(id: string) {
      this.queue.delete(id);
      return this;
    }
}

export interface IFormatState {
    formats: FormatsGroup[];
    loading: boolean;
}

export class FormatState extends State<IFormatState> {
    private formats: FormatsGroup[] = [];
    private loading: boolean = true;

    public get data() {
        return {
            formats: this.formats,
            loading: this.loading,
        }
    }

    public set(formats: FormatsGroup[], loading = false) {
        this.formats = formats;
        this.loading = loading;
        return this;
    }
}

export interface IServerState {
    active?: Server;
    list: Map<string, Server>
}

export class ServerState extends State<IServerState> {
    private active?: Server = undefined;
    private list: Map<string, Server> = new Map();

    public get data() {
        return {
            active: this.active,
            list: this.list,
        }
    }

    public setList(...servers: Server[]) {
        for (const server of servers) {
            this.list.set(server.options.host, server);
        }
        return this;
    }

    public setActive(server: Server) {
        this.active = server;
        return this;
    }
}

export interface IErroState {
  list: Error[];
}

export class ErrorState extends State<IErroState> {
  private list: Error[] = [];

  public get data() {
    return {
      list: this.list,
    }
  }

  public append(error: Error) {
    this.list.push(error);
    return this;
  }
}

export interface IUiState {
	toasts: Map<string, Toast>;
}

export class UiState extends State<IUiState> {
	private toasts: Map<string, Toast> = new Map();

	public get data() {
		return {
			toasts: this.toasts
		}
	}

	public append(toast: Toast) {
		this.toasts.set(toast.id, toast);
		return this;
	}

	public remove(id: string) {
		this.toasts.delete(id);
		return this;
	}
}
