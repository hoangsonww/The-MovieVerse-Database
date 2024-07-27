import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

function translateFBC(value) {
    return atob(value);
}

function getFBConfig1() {
    const fbConfig1 = "QUl6YVN5REw2a1FuU2ZVZDhVdDhIRnJwS3VpdnF6MXhkWG03aw==";
    return translateFBC(fbConfig1);
}

function getFBConfig2() {
    const fbConfig2 = "bW92aWV2ZXJzZS1hcHAuZmlyZWJhc2VhcHAuY29t";
    return translateFBC(fbConfig2);
}

function getFBConfig3() {
    const fbConfig3 = "bW92aWV2ZXJzZS1hcHAuYXBwc3BvdC5jb20=";
    return translateFBC(fbConfig3);
}

function getFBConfig4() {
    const fbConfig4 = "ODAyOTQzNzE4ODcx";
    return translateFBC(fbConfig4);
}

function getFBConfig5() {
    const fbConfig5 = "MTo4MDI5NDM3MTg4NzE6d2ViOjQ4YmM5MTZjYzk5ZTI3MjQyMTI3OTI=";
    return translateFBC(fbConfig5);
}

const firebaseConfig = {
    apiKey: getFBConfig1(),
    authDomain: getFBConfig2(),
    projectId: "movieverse-app",
    storageBucket: getFBConfig3(),
    messagingSenderId: getFBConfig4(),
    appId: getFBConfig5()
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
