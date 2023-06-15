import tape from "tape";
import React from "react";
import { shallow, mount } from "enzyme";

import { Compass } from "../../../src/js/components/compass";

tape("Compass ", (t) => {
  const wrapperN = shallow(<Compass direction="n" />);
  t.equal(
    wrapperN.find(".compass_pointer--north").length,
    1,
    "renders north direction"
  );

  const wrapperE = shallow(<Compass direction="e" />);
  t.equal(
    wrapperE.find(".compass_pointer--east").length,
    1,
    "renders east direction"
  );

  const wrapperS = shallow(<Compass direction="s" />);
  t.equal(
    wrapperS.find(".compass_pointer--south").length,
    1,
    "renders south direction"
  );

  const wrapperW = shallow(<Compass direction="w" />);
  t.equal(
    wrapperW.find(".compass_pointer--west").length,
    1,
    "renders west direction"
  );

  t.end();
});
