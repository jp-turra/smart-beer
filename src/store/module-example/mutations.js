export function setDevice(state, payload) {
  state.device = payload;
}
export function setLastMessage(state, payload) {
  state.lastMessage = payload;
  state.history.push(payload);
}
