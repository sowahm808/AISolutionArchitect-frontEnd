import { AppStore } from "./app.store";
describe("AppStore", () => {
  it("tracks token authentication", () => {
    const s = new AppStore();
    s.setToken("x");
    expect(s.isAuthenticated()).toBeTrue();
    s.setToken(null);
    expect(s.isAuthenticated()).toBeFalse();
  });
});
