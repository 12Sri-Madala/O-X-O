// Options are 'local', 'staging', 'staging-final', 'production'
const SERVER = "staging-final";

const serverInfo = {};

if (SERVER === "local") {
  serverInfo.name = "http://localhost:5000";
  serverInfo.stripePublicKey = "pk_test_7Hatfb7bdJuKHTHwdusk2R1L";
} else if (SERVER === "staging") {
  serverInfo.name = "https://owner-staging.herokuapp.com";
  serverInfo.stripePublicKey = "pk_test_7Hatfb7bdJuKHTHwdusk2R1L";
} else if (SERVER === "staging-final") {
  serverInfo.name = "https://owner-staging-final.herokuapp.com";
  serverInfo.stripePublicKey = "pk_test_7Hatfb7bdJuKHTHwdusk2R1L";
} else if (SERVER === "production") {
  serverInfo.name = "https://owner-production-1.herokuapp.com";
  serverInfo.stripePublicKey = "pk_live_2HutMxLg5h4GQhNvfHcFPaJK";
}

export default serverInfo;
