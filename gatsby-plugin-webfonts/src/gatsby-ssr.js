import React from "react";
import fs from "fs";
import path from "path";
import isEmpty from "lodash.isempty";

import createOptions from "./create-options";
import { isGooglePreconnectEnabled } from "./modules/google";
import Preconnect from "./components/preconnect";
import Preload from "./components/preload";
import Css from "./components/css";

export const onRenderBody = (
  { setHeadComponents, pathname },
  pluginOptions,
) => {
  const blackListPaths = pluginOptions.blacklist;

  let isBlackListedPath;

  if (blackListPaths && blackListPaths.length > 0) {
    blackListPaths.forEach(path => {
      if (pathname.includes(path)) {
        isBlackListedPath = true;
      }
    });
  }

  if (isBlackListedPath) return;

  if (isEmpty(pluginOptions.fonts)) return;

  const { usePreload, formats, ...options } = createOptions(pluginOptions);

  const css = fs.readFileSync(
    path.join(`./.cache`, `webfonts`, `webfonts.css`),
    `utf8`,
  );

  setHeadComponents([
    <Preconnect
      key="webFontsPreconnectGoogleFonts"
      disabled={!isGooglePreconnectEnabled(options)}
      href="https://fonts.googleapis.com"
    />,
    <Preload
      key="webFontsPreload"
      disabled={!usePreload}
      format={formats[0]}
      css={css}
    />,
    <Css key="webFontsCss" css={css} />,
  ]);
};
