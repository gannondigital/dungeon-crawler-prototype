import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

// @todo genericize
import "./game-root.spec.js";
import "./compass.spec.js";
