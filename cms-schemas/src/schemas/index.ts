import agency from "./agency";
import caseStudy from "./caseStudy";
import contactSubmission from "./contactSubmission";
import people from "./people";
import post from "./post";
import service from "./service";
import siteSettings from "./siteSettings";
import testimonial from "./testimonial";

export const schemaTypes = [
  siteSettings,
  service,
  caseStudy,
  post,
  testimonial,
  people,
  agency,
  contactSubmission
];

export const schemaModules = {
  siteSettings,
  service,
  caseStudy,
  post,
  testimonial,
  people,
  agency,
  contactSubmission
};

export default schemaTypes;
