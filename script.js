"use strict";

/* =====================================================
   RONY FF OFFICIAL - FIXED SCRIPT
   ===================================================== */

const ACCOUNT_KEY = "rony_demo_accounts";
const CURRENT_USER_KEY = "rony_current_user";
const THEME_KEY = "rony_theme";

/* =====================================================
   HELPERS
   ===================================================== */

function get(id) {
    return document.getElementById(id);
}

function accounts() {
    try {
        return JSON.parse(localStorage.getItem(ACCOUNT_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveAccounts(data) {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(data));
}

function currentUser() {
    return localStorage.getItem(CURRENT_USER_KEY);
}

function setUser(username) {
    localStorage.setItem(CURRENT_USER_KEY, username);
}

function removeUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

function message(id, text, success = false) {
    const el = get(id);

    if (!el) return;

    el.textContent = text;
    el.classList.toggle("success", success);
}

function clearMessage(id) {
    const el = get(id);

    if (el) {
        el.textContent = "";
        el.classList.remove("success");
    }
}

/* =====================================================
   LOADING SCREEN - FIX
   ===================================================== */

function hideLoading() {
    const loading = get("loadingScreen");

    if (!loading) return;

    loading.style.opacity = "0";
    loading.style.pointerEvents = "none";

    setTimeout(function () {
        loading.style.display = "none";
    }, 300);
}

/* =====================================================
   PAGE SYSTEM
   ===================================================== */

const pageMap = {
    dashboard: "dashboardPage",
    login: "loginPage",
    register: "registerPage",
    forgotPassword: "forgotPasswordPage",
    changeGmail: "changeGmailPage",
    deposit: "depositPage",
    buyKeys: "buyKeysPage",
    resellers: "resellersPage",
    myKeys: "myKeysPage",
    history: "historyPage",
    support: "supportPage",
    refer: "referPage",
    apiPassword: "apiPasswordPage",
    profile: "profilePage"
};

function closeMenu() {
    const menu = get("sideMenu");
    const overlay = get("menuOverlay");

    if (menu) {
        menu.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }
}

function showPage(name) {

    const targetId = pageMap[name];

    if (!targetId) return;

    const target = get(targetId);

    if (!target) return;

    document.querySelectorAll(".page").forEach(function (page) {
        page.classList.remove("active");
    });

    target.classList.add("active");

    closeMenu();

    window.scrollTo(0, 0);
}

function go(name) {
    showPage(name);
}

/* =====================================================
   SIDE MENU
   ===================================================== */

function openMenu() {

    const menu = get("sideMenu");
    const overlay = get("menuOverlay");

    if (menu) {
        menu.classList.add("active");
    }

    if (overlay) {
        overlay.classList.add("active");
    }
}

function setupMenu() {

    const open = get("openMenu");
    const close = get("closeMenu");
    const overlay = get("menuOverlay");

    if (open) {
        open.onclick = openMenu;
    }

    if (close) {
        close.onclick = closeMenu;
    }

    if (overlay) {
        overlay.onclick = closeMenu;
    }
}

/* =====================================================
   ALL DATA-PAGE BUTTONS
   ===================================================== */

function setupNavigation() {

    document.querySelectorAll("[data-page]").forEach(function (button) {

        button.addEventListener("click", function (e) {

            e.preventDefault();

            const page = button.getAttribute("data-page");

            if (page) {
                go(page);
            }
        });
    });

    document.querySelectorAll("[data-dashboard]").forEach(function (button) {

        button.addEventListener("click", function (e) {

            e.preventDefault();

            const page = button.getAttribute("data-dashboard");

            if (page) {
                go(page);
            }
        });
    });
}

/* =====================================================
   LOGIN
   ===================================================== */

function setupLogin() {

    const form = get("loginForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const usernameEl = get("username");
        const passwordEl = get("password");

        const username = usernameEl
            ? usernameEl.value.trim()
            : "";

        const password = passwordEl
            ? passwordEl.value
            : "";

        clearMessage("loginMessage");

        if (!username || !password) {

            message(
                "loginMessage",
                "Username और Password भरें।"
            );

            return;
        }

        const list = accounts();

        const user = list.find(function (item) {

            return (
                String(item.username).toLowerCase() ===
                username.toLowerCase() &&
                String(item.password) === password
            );

        });

        if (!user) {

            message(
                "loginMessage",
                "Username या Password गलत है।"
            );

            return;
        }

        setUser(user.username);

        message(
            "loginMessage",
            "Login Successful!",
            true
        );

        setTimeout(function () {
            updateDashboard();
            go("dashboard");
        }, 400);
    });
}

/* =====================================================
   GOOGLE LOGIN DEMO
   ===================================================== */

function setupGoogleLogin() {

    const button = get("googleLoginButton");

    if (!button) return;

    button.onclick = function () {

        message(
            "loginMessage",
            "Google Login अभी Demo है। Real Google account chooser के लिए Google OAuth लगाना होगा।"
        );
    };
}

/* =====================================================
   REGISTER
   ===================================================== */

function setupRegister() {

    const form = get("registerForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const username = get("registerUsername")?.value.trim();
        const email = get("registerEmail")?.value.trim();
        const password = get("registerPassword")?.value;
        const confirm = get("registerConfirm")?.value;

        clearMessage("registerMessage");

        if (!username || !email || !password || !confirm) {

            message(
                "registerMessage",
                "सभी fields भरें।"
            );

            return;
        }

        if (password !== confirm) {

            message(
                "registerMessage",
                "दोनों Password समान नहीं हैं।"
            );

            return;
        }

        const list = accounts();

        const usernameExists = list.some(function (user) {

            return String(user.username).toLowerCase() ===
                username.toLowerCase();

        });

        if (usernameExists) {

            message(
                "registerMessage",
                "यह Username पहले से मौजूद है।"
            );

            return;
        }

        const emailExists = list.some(function (user) {

            return String(user.email).toLowerCase() ===
                email.toLowerCase();

        });

        if (emailExists) {

            message(
                "registerMessage",
                "यह Gmail पहले से registered है।"
            );

            return;
        }

        const newUser = {

            id: Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase(),

            username: username,
            email: email,
            password: password,

            balance: 0,
            sales: 0,
            keys: 0,
            referrals: 0,

            createdAt: new Date().toISOString()
        };

        list.push(newUser);

        saveAccounts(list);

        message(
            "registerMessage",
            "Account Successfully Created!",
            true
        );

        form.reset();

        setTimeout(function () {
            go("login");
        }, 700);
    });
}

/* =====================================================
   GOOGLE REGISTER DEMO
   ===================================================== */

function setupGoogleRegister() {

    const button = get("googleRegisterButton");

    if (!button) return;

    button.onclick = function () {

        message(
            "registerMessage",
            "Google Register अभी Demo है।"
        );
    };
}

/* =====================================================
   FORGOT PASSWORD
   ===================================================== */

function setupForgotPassword() {

    const form = get("passwordForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const account =
            get("passwordAccount")?.value.trim();

        const oldPassword =
            get("currentPassword")?.value;

        const newPassword =
            get("newPassword")?.value;

        const confirm =
            get("confirmNewPassword")?.value;

        clearMessage("passwordMessage");

        if (
            !account ||
            !oldPassword ||
            !newPassword ||
            !confirm
        ) {

            message(
                "passwordMessage",
                "सभी fields भरें।"
            );

            return;
        }

        if (newPassword !== confirm) {

            message(
                "passwordMessage",
                "New Password और Confirm Password समान नहीं हैं।"
            );

            return;
        }

        const list = accounts();

        const index = list.findIndex(function (user) {

            return (
                String(user.username).toLowerCase() ===
                account.toLowerCase() ||
                String(user.email).toLowerCase() ===
                account.toLowerCase()
            );

        });

        if (index === -1) {

            message(
                "passwordMessage",
                "Account नहीं मिला।"
            );

            return;
        }

        if (String(list[index].password) !== String(oldPassword)) {

            message(
                "passwordMessage",
                "Current Password गलत है।"
            );

            return;
        }

        list[index].password = newPassword;

        saveAccounts(list);

        message(
            "passwordMessage",
            "Password Successfully Changed!",
            true
        );

        form.reset();
    });
}

/* =====================================================
   CHANGE GMAIL
   ===================================================== */

function setupChangeGmail() {

    const form = get("gmailForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const account =
            get("gmailAccount")?.value.trim();

        const newGmail =
            get("newGmail")?.value.trim();

        clearMessage("gmailMessage");

        if (!account || !newGmail) {

            message(
                "gmailMessage",
                "सभी fields भरें।"
            );

            return;
        }

        const list = accounts();

        const index = list.findIndex(function (user) {

            return String(user.username).toLowerCase() ===
                account.toLowerCase();

        });

        if (index === -1) {

            message(
                "gmailMessage",
                "Account नहीं मिला।"
            );

            return;
        }

        const emailExists = list.some(function (user, i) {

            return (
                i !== index &&
                String(user.email).toLowerCase() ===
                newGmail.toLowerCase()
            );

        });

        if (emailExists) {

            message(
                "gmailMessage",
                "यह Gmail पहले से इस्तेमाल हो रहा है।"
            );

            return;
        }

        list[index].email = newGmail;

        saveAccounts(list);

        message(
            "gmailMessage",
            "Gmail Successfully Changed!",
            true
        );

        form.reset();
    });
}

/* =====================================================
   DASHBOARD UPDATE
   ===================================================== */

function updateDashboard() {

    const username = currentUser();

    if (!username) return;

    const list = accounts();

    const user = list.find(function (item) {

        return item.username === username;

    });

    if (!user) return;

    const balance = get("balanceValue");

    if (balance) {
        balance.textContent =
            Number(user.balance || 0).toFixed(2);
    }

    const profileUsername =
        get("profileUsername");

    if (profileUsername) {
        profileUsername.textContent =
            user.username;
    }

    const todaySales =
        get("todaySales");

    if (todaySales) {
        todaySales.textContent =
            user.sales || 0;
    }

    const myUsers =
        get("myUsers");

    if (myUsers) {
        myUsers.textContent =
            list.length;
    }

    const monthSell =
        get("monthSell");

    if (monthSell) {
        monthSell.textContent =
            user.sales || 0;
    }

    const myResellers =
        get("myResellers");

    if (myResellers) {
        myResellers.textContent =
            user.referrals || 0;
    }

    const referral =
        get("referralCode");

    if (referral) {
        referral.textContent =
            "RONY-" + user.username.toUpperCase();
    }
}

/* =====================================================
   LOGOUT
   ===================================================== */

function setupLogout() {

    const button = get("logoutButton");

    if (!button) return;

    button.onclick = function () {

        removeUser();

        closeMenu();

        go("login");

        message(
            "loginMessage",
            "आप Logout हो गए हैं।",
            true
        );
    };
}

/* =====================================================
   COPY REFERRAL
   ===================================================== */

function setupCopy() {

    const button = get("copyReferral");

    if (!button) return;

    button.onclick = async function () {

        const code =
            get("referralCode")?.textContent.trim();

        if (!code) return;

        try {

            await navigator.clipboard.writeText(code);

            const old =
                button.textContent;

            button.textContent = "Copied!";

            setTimeout(function () {
                button.textContent = old;
            }, 1200);

        } catch (e) {

            alert("Referral Code: " + code);
        }
    };
}

/* =====================================================
   THEME
   ===================================================== */

function setupTheme() {

    const button = get("themeButton");

    const saved =
        localStorage.getItem(THEME_KEY);

    if (saved === "light") {
        document.body.classList.add("light-mode");
    }

    if (!button) return;

    button.onclick = function () {

        const light =
            document.body.classList.toggle("light-mode");

        localStorage.setItem(
            THEME_KEY,
            light ? "light" : "dark"
        );
    };
}

/* =====================================================
   DEPOSIT BUTTON
   ===================================================== */

function setupDeposit() {

    document.querySelectorAll(".deposit-help")
        .forEach(function (button) {

            button.onclick = function () {
                go("deposit");
            };

        });
}

/* =====================================================
   HOW TO BUY
   ===================================================== */

function setupHowToBuy() {

    document.querySelectorAll(".how-to-buy")
        .forEach(function (button) {

            button.onclick = function () {
                go("buyKeys");
            };

        });
}

/* =====================================================
   ESC = CLOSE MENU
   ===================================================== */

function setupEscape() {

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {
            closeMenu();
        }

    });
}

/* =====================================================
   INITIALIZE EVERYTHING
   ===================================================== */

function initialize() {

    /*
       सबसे पहले loading हटाएँ
    */
    setTimeout(function () {
        hideLoading();
    }, 1200);

    /*
       सभी functions initialize करें
    */
    setupMenu();
    setupNavigation();

    setupLogin();
    setupGoogleLogin();

    setupRegister();
    setupGoogleRegister();

    setupForgotPassword();
    setupChangeGmail();

    setupLogout();
    setupCopy();

    setupTheme();
    setupDeposit();
    setupHowToBuy();

    setupEscape();

    /*
       Login state
    */
    setTimeout(function () {

        const user = currentUser();

        if (user) {

            const exists =
                accounts().some(function (item) {
                    return item.username === user;
                });

            if (exists) {

                updateDashboard();
                go("dashboard");

            } else {

                removeUser();
                go("login");
            }

        } else {

            /*
               पहली बार हमेशा Login
            */
            go("login");
        }

    }, 1250);
}

/* =====================================================
   START
   ===================================================== */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

} else {

    initialize();
}