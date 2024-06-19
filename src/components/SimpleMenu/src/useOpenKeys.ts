import type { Menu as MenuType } from '/@/router/types';
import type { MenuState } from './types';

import { computed, Ref, toRaw } from 'vue';

import { unref } from 'vue';
import { uniq } from 'lodash-es';
import { getAllParentPath } from '/@/router/helper/menuHelper';

import { useTimeoutFn } from '/@/hooks/core/useTimeout';
import { useDebounceFn } from '@vueuse/core';
import { eachTree } from '/@/utils/helper/treeHelper';

export function useOpenKeys(
  menuState: MenuState,
  menus: Ref<MenuType[]>,
  accordion: Ref<boolean>,
  mixSider: Ref<boolean>,
  collapse: Ref<boolean>,
) {
  const debounceSetOpenKeys = useDebounceFn(setOpenKeys, 50);

  async function setOpenKeys(path: string) {
    const native = !mixSider.value;
    const menuList = toRaw(menus.value);

    // 提取菜单所有的key，即每一个菜单路由选项的path
    const allRoutePaths: string[] = [];
    eachTree(menuList, (menu) => allRoutePaths.push(menu.path));

    useTimeoutFn(
      () => {
        if (menuList?.length === 0) {
          menuState.activeSubMenuNames = [];
          menuState.openNames = [];
          return;
        }
        const keys = getAllParentPath(menuList, path);
        if (!unref(accordion)) {
          // 仅在页面初始化的时候展开全部菜单
          menuState.openNames =
            menuState.activeSubMenuNames.length === 0 && menuState.openNames.length === 0
              ? uniq([...allRoutePaths, ...menuState.openNames, ...keys])
              : uniq([...menuState.openNames, ...keys]);
        } else {
          menuState.openNames = keys;
        }
        menuState.activeSubMenuNames = menuState.openNames;
      },
      30,
      native,
    );
  }

  const getOpenKeys = computed(() => {
    return unref(collapse) ? [] : menuState.openNames;
  });

  return { setOpenKeys: debounceSetOpenKeys, getOpenKeys };
}
