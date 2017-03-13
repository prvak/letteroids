import HullGenerator from "./HullGenerator";

/** List of functions that generate the actuall instance of a specified hull. */
const Hulls = {
  hill: () => {return HullGenerator.theHill(HullGenerator.theRock);},
};

export default Hulls;
