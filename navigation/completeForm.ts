import { CommonActions, type NavigationProp, type ParamListBase } from '@react-navigation/native';

// Leaves a multi-step form: drops every screen from `formStart` onward and lands on
// `destination`, so back returns to wherever the user was before the form began.
// Single-screen forms just use navigation.replace.
export function completeForm(
  navigation: Pick<NavigationProp<ParamListBase>, 'dispatch'>,
  formStart: string,
  destination: string,
  params?: object
) {
  navigation.dispatch((state) => {
    const start = state.routes.findIndex((route) => route.name === formStart);
    const kept = state.routes.slice(0, start === -1 ? -1 : start);
    const routes = [...kept, { key: `${destination}-${Date.now()}`, name: destination, params }];
    return CommonActions.reset({ ...state, routes, index: routes.length - 1 });
  });
}
