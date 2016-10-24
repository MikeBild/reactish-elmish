declare type Msg = {
  type: string,
  payload?: Object
}

declare type HtmlMsg = Msg
declare type CmdMsg = Msg
declare type SubMsg = Msg

declare module 'elmish' {
	declare module.exports: {
		createStore(msg: Msg): Object;
	};
}

declare module 'reactish' {
	declare module.exports: {
		createStore(msg: Msg): Object;
	};
}