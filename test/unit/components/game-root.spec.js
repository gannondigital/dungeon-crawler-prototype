import tape from "tape";
import React from "react";
import { shallow, mount } from "enzyme";

import { GameRoot } from "../../../src/js/components/game-root";
import { Passage } from "../../../src/js/components/Passage/passage";

tape("GameRoot", (t) => {
  const wrapper = shallow(<GameRoot />);
  t.equal(wrapper.find(Passage).length, 1, "renders a Passage");
  t.end();
});
