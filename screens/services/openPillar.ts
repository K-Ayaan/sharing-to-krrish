// Opens a service from anywhere (Home, Services, Search). Someone not yet registered goes to that
// service's registration screen first (SDD §2.5), then into it.
import { CommonActions, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import type { PillarKey } from '../../data/mock/mockUser';

const ENTRY: Record<PillarKey, { stack: string; hub: string; register: string }> = {
  vandhan: { stack: 'VanDhan', hub: 'VanDhanHub', register: 'VanDhanRegister' },
  livestock: { stack: 'Livestock', hub: 'LivestockBrowse', register: 'LivestockRegister' },
  lpg: { stack: 'Lpg', hub: 'LpgHub', register: 'LpgRegister' },
  microfinance: { stack: 'MicroFinance', hub: 'MicroFinanceApplicationStatus', register: 'MicroFinanceRegister' },
};

type Dispatcher = Pick<NavigationProp<ParamListBase>, 'navigate' | 'dispatch'>;

export function openPillar(navigation: Dispatcher, pillar: PillarKey, registered: boolean) {
  const entry = ENTRY[pillar];
  const target = registered ? entry.hub : entry.register;

  // The Services tab is rebuilt as exactly [Services hub, this service], so whichever service was
  // open before is gone: Back from Van Dhan reaches Services, never the service visited before it.
  // A plain navigate would push this service on top of that one instead.
  navigation.dispatch((state) => {
    const index = state.routes.findIndex((route) => route.name === 'ServicesTab');
    // Not this navigator's job — hand it upwards, where the tabs live.
    if (index === -1) {
      return CommonActions.navigate('ServicesTab', {
        screen: entry.stack,
        initial: false,
        params: { screen: target },
      });
    }
    const routes = state.routes.map((route, position) =>
      position === index
        ? {
            ...route,
            state: {
              index: 1,
              routes: [
                { name: 'ServicesHub' },
                { name: entry.stack, state: { index: 0, routes: [{ name: target }] } },
              ],
            },
          }
        : route
    );
    return CommonActions.reset({ ...state, index, routes });
  });
}
