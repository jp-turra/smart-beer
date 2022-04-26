export function setDevice(state, payload) {
  state.device = payload;
}
export function setLastMessage(state, payload) {
  state.lastMessage = payload;
  pushHistory(state, "RECEIVE - " + JSON.stringify(payload));
}
export function pushHistory(state, payload) {
  state.history.push(payload);
}
