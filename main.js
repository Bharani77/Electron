const { app, BrowserWindow, session } = require('electron');
const fs = require('fs');

let isPageInitialized = false;

const rc = "0ucla7z0ga";
const planet = "THE_BOT";
let auto = "true"; // Need to work
let license = "TEST_LICENSE"; //Need to work
console.log(license);
let timediff = 0;
//fetch from execute.sh
let rival = "null";
let time = "null";
let status_tab = false;
let adjustTime = 0;
let reduce = 10;
let reduced = 1;
let count = 2;
let checkPlanetVar = false;
let checkPlanetPrisonVar = false;
let released = 0;

app.commandLine.appendSwitch('--disable-web-security');
app.commandLine.appendSwitch('--disable-extensions');
app.commandLine.appendSwitch('--disable-infobars');
app.commandLine.appendSwitch('--disable-dev-shm-usage');
app.commandLine.appendSwitch('--disable-gpu');
app.commandLine.appendSwitch('--disable-software-rasterizer');
app.commandLine.appendSwitch('--disable-background-timer-throttling');
app.commandLine.appendSwitch('--disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('--disable-renderer-backgrounding');
app.commandLine.appendSwitch('--disable-accelerated-2d-canvas');
//app.commandLine.appendSwitch('--no-sandbox');
app.commandLine.appendSwitch('--disable-setuid-sandbox');
app.commandLine.appendSwitch('--disable-popup-blocking');
app.commandLine.appendSwitch('--disable-images');
app.commandLine.appendSwitch('--blink-settings=imagesEnabled=false');
function createWindow() {
  const mainWindow = new BrowserWindow({
    show: false,
    width: 1800,
    height: 600,
    webPreferences: {
      images: false, // Disable loading of images
      allowRunningInsecureContent: true,
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false
    }
  });
   const blockedFileTypes = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.css', '.woff', '.woff2', '.ttf', '.otf', '.eot', '.ico', '.wav'];

  // Intercept requests to block specified file types
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const url = details.url.toLowerCase();
    if (blockedFileTypes.some(type => url.endsWith(type))) {
      // Block the request by returning an object with cancel: true
      callback({ cancel: true });
    } else {
      // Allow the request to continue
      callback({});
    }
  });
  mainWindow.loadURL('https://galaxy.mobstudio.ru/web/');

  mainWindow.webContents.on('did-finish-load', async () => {
    try {
            console.log(license);
      if (license === "TEST_LICENSE"){
      if (!isPageInitialized) {
        session.defaultSession.clearStorageData({
            storages: ['appcache', 'cookies', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers'],
        }, () => {
              // Session data cleared
          });
        await initializePage(mainWindow);
        await mainWindow.webContents.executeJavaScript(`localStorage.setItem('adjustTime', 0)`);
        await mainWindow.webContents.executeJavaScript(`localStorage.setItem('loopTime', 1)`);
        await mainWindow.webContents.executeJavaScript(`localStorage.setItem('release', 0)`);
        isPageInitialized = true;
      }
      await clickElementAndWait(mainWindow, rival, time, planet, auto);
      }else{
        console.log("Invalid License");
      }
    } catch (error) {
      console.error('An error occurred:', error);
      //   mainWindow.reload();
      //  await sleep (2000);
    }
  });
}

async function initializePage(mainWindow) {
  const title = await mainWindow.webContents.getTitle();
  console.log('Page title:', title);
  console.log('THALA THUNDER');
  console.log('BETA 1.0v');
  //await sleep(2000);
  await clickElement(mainWindow, '.mdc-button--black-secondary > .mdc-button__label', 'css');
  //await sleep(2000);
  await clickElement(mainWindow, 'input[name="recoveryCode"]', { value: rc }, 'css');
  await clickElement(mainWindow, '.mdc-dialog__button:nth-child(2)', 'css');
}

async function clickElement(mainWindow, selector, options = {}, selectorType = 'css') {
  const script = `
    (async function() {
      const element = ${
        selectorType === 'css'
          ? `document.querySelector('${selector}')`
          : `document.evaluate('${selector}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`
      };

      if (element) {
        ${options.value ? `element.value = '${options.value}';` : ''}
        element.click();
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    })();
  `;

  await mainWindow.webContents.executeJavaScript(script);
}

async function clickElementAndWait(mainWindow, rival, time, planet, auto) {
  try {
    const result = await updateRivalAndTime(mainWindow, planet);
    time = result.time;
    rivalArray = result.rival;
    count = result.count;
    checkPlanetVar = result.checkPlanetVar;
	status_tab = await waitForElement(mainWindow, '//*[@id="root"]/div/div[2]/div[2]/div[1]/div[6]/div');
    if (count !== "1" && checkPlanetVar && status_tab) {
    const currentTimeWithMillisecondsStart = new Date().getTime();
    await clickElement(mainWindow, `//span[contains(text(), "${planet}")]`, {}, 'xpath');
    await clickElement(mainWindow, '//span[contains(text(), "Online now")]', {}, 'xpath');
    const rivals = await mainWindow.webContents.executeJavaScript(`
      Array.from(document.querySelectorAll('li')).map(rival => rival.textContent)
    `);
    const targetIndex = rivals.findIndex(r => rivalArray.some(word => r.includes(word)));
    if (targetIndex !== -1) {
      adjustTime = await mainWindow.webContents.executeJavaScript('localStorage.getItem("adjustTime")');
      if (adjustTime == 0){
	time = parseInt(result.time) - 5 * reduced;
        reduced = reduced + 1;
        if (reduced >= 10){
          reduced = 1;
        }
        console.log("Updated value 1"+time);
      }else{
        time = parseInt(result.time) - 5 * reduce;
        reduce = reduce - 1;
        if (reduce <= 0){
          reduce = 20;
        }
        console.log("Updated time value 2"+time);
        await mainWindow.webContents.executeJavaScript(`localStorage.setItem('adjustTime', 0)`);
      }
      await mainWindow.webContents.executeJavaScript(`
        (() => {
            const rivals = Array.from(document.querySelectorAll('li'));
            const target = rivals[${targetIndex}];
            if (target) {
                target.click();
            }
        })()
    `);
      await clickElement(mainWindow, '.planet-bar__button__action > img', {}, 'css');
      const currentTimeWithMillisecondsEnd = new Date().getTime();
      let Diff = currentTimeWithMillisecondsEnd - currentTimeWithMillisecondsStart
      console.log(Diff);
      await waitingTime(auto, time, timediff, Diff);
     // await clickElement(mainWindow, '//span[contains(text(), "Imprison")]', {}, 'xpath');
      // Use Promise.all to execute all three tasks concurrently
      //await clickElement(mainWindow, '//span[contains(text(), "Imprison")]', {}, 'xpath');
      //mainWindow.webContents.reload();
      Promise.all([
      //  clickElementPromise(mainWindow, '.dialog__close-button > img', {}, 'css'),
	clickElement(mainWindow, '//span[contains(text(), "Imprison")]', {}, 'xpath'),
	await waitingTime(auto, time, timediff, Diff);
        clickElementPromise(mainWindow, '//a[contains(., "Exit")]', {}, 'xpath'),
        reloadWindowPromise(mainWindow)
      ])
        .then(() => {
          // All tasks completed successfully
          console.log('All tasks completed successfully');
        })
        .catch((error) => {
          // Handle errors from any of the tasks
          console.error('Error:', error.message);
        });
	const currentTimeWithMillisecondsAfterImprison = new Date().getTime();
      const predictTime = currentTimeWithMillisecondsAfterImprison - currentTimeWithMillisecondsStart
      console.log("Prediction time"+predictTime);
    } else {
      console.log("Here rival not found");
      await clickElement(mainWindow, 'button:nth-child(2) > img', {}, 'css');
      await mainWindow.webContents.executeJavaScript(`localStorage.setItem('loopTime', 2)`);
      //time = time - 20;
      //console.log("New time" +time);
      await mainWindow.webContents.executeJavaScript(`localStorage.setItem('adjustTime', 1)`);
      await clickElementAndWait(mainWindow, rival, time, planet, auto);
      // Wait for the page to finish reloading before continuing
      // await new Promise(resolve => {
      //   mainWindow.once('did-finish-load', resolve);
      //   mainWindow.reload(); // Reload the page
      // });
    }
    isPageInitialized = true;
  //}else if(count === "1"){
   //   mainWindow.reload();
   //   await mainWindow.webContents.executeJavaScript(`localStorage.setItem('loopTime', 2)`);
  }
  else{
    await planetFly(mainWindow, planet);
  }
  } catch (error) {
    console.error('An error occurred in clickElementAndWait:', error.message);
    isPageInitialized = true;
  }
}

async function waitForElementInFrameByIndex(window, iframeIndex, selectorType, selector,value) {
  let attempts = 0;
  let maxAttempts = 50,
  interval = 200;

  const intervalId = setInterval(async () => {
    try {
      attempts++;

      const result = await window.webContents.executeJavaScript(`
        (() => {
          try {
            const iframeIndex = ${iframeIndex}; // Set the desired index here
            const iframes = document.querySelectorAll('iframe');

            if (iframes.length > 1) {
              const iframe = iframes[iframeIndex];

              // Check if the iframe has a contentDocument and it's not null
              if (iframe && iframe.contentDocument) {
                if ('${selectorType}' === 'xpath') {
              contentElement = iframe.contentDocument.evaluate('${selector}', iframe.contentDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                } else if ('${selectorType}' === 'css') {
                contentElement = iframe.contentDocument.querySelector('${selector}');
                }
                if (contentElement) {
                  // Click the element inside the iframe
                  contentElement.click();
                  window.parent.focus();
                  return true;
                } else {
                  console.error('Element with "${selector}" not found in the iframe.');
                  return false;
                }
              } else {
                console.error('Iframe contentDocument is undefined or null.');
                return false;
              }
            } else {
              console.error('Iframe at index ${iframeIndex} not found.');
              return null;
            }
          } catch (error) {
            console.error('Error:', error.message);
            return null;
          }
        })()
      `);
      if (value === "required" && result === true){
         await clickElement(window, 'button.mdc-button.mdc-dialog__button[data-mdc-dialog-action="accept"]', {}, 'css');
         await sleep(5000);
         await clickElement(window, '.mdc-icon-button > img', {}, 'css');
      }

      if (value === "reloadRequired" && result === true){
        window.webContents.reload();
      }
      // If the result is true or the maximum attempts are reached, clear the interval
      if (result === true || attempts >= maxAttempts) {
        clearInterval(intervalId);
      }

      // Log the result
      console.log(result);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }, interval);
}


async function waitForContent(mainWindow) {
  // Wait for a specific amount of time after the page has loaded
  // Wait for the 'content' element to be present
  await sleep (300);
  const contentElementInFrame = await waitForElementInFrameByIndex(mainWindow.webContents, 2);
  console.log(contentElementInFrame);
  if (contentElementInFrame) {
    return true;
  } else {
    return false;
  }
}

async function waitForElement(window, xpath) {
  try{
    return window.webContents.executeJavaScript(`
        new Promise((resolve) => {
            const intervalId = setInterval(() => {
                const element = document.evaluate('${xpath}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (element) {
                    clearInterval(intervalId);
                    resolve(true);
                }
            }, 100);
        });
    `);
  }catch{
    console.error('Error:', error.message);
    return null;
  }
}

function clickElementPromise(window, selector, options, method) {
        return new Promise((resolve, reject) => {
          clickElement(window, selector, options, method)
            .then(() => resolve())
            .catch((error) => reject(error));
        });
      }
      // Function to reload the mainWindow and return a promise
function reloadWindowPromise(window) {
        return new Promise((resolve) => {
          window.reload();
          resolve();
        });
}

async function checkPlanet(window, planet) {
  try {
    await waitForElement(window, '//div[2]/span');
    const result = await window.webContents.executeJavaScript(`
      new Promise((resolve) => {
            const intervalId = setInterval(() => {
                const xpathExpression = '//span[contains(text(), "${planet}")]';
                const element = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (element) {
                    clearInterval(intervalId);
                    resolve(true);
                }else{
                  resolve(false);
                }
            }, 100);
        });
    `);

    return result;
  } catch (error) {
    console.log("Caught an error:", error);
    return null;
  }
}

async function planetFly(window, planet) {
  try {
    //  await sleep(2000);
      await waitForElement(window, '//div[2]/span');
    //  checkPlanetVar = await checkPlanet(window, planet);
      checkPlanetPrisonVar = await checkPlanet(window, "Prison");
    if (!checkPlanetPrisonVar) {
          console.log('You are already in attacking planet!!!');
		  await window.webContents.executeJavaScript(`localStorage.setItem('loopTime', 2)`);
          window.webContents.reload();
    }else{
        console.log('You are in Prison!!!');
        await release(window, planet);
    }
  }catch(error){
    console.log(error);
  }
}

async function release(window, planet) {

  try {
    released = await window.webContents.executeJavaScript('localStorage.getItem("release")');
    console.log("release"+released);
    if (released === "0"){
      console.log("Entered into release");
      await window.reload();
      await window.webContents.executeJavaScript(`localStorage.setItem('release', 1)`);
    }else{
    await window.webContents.executeJavaScript(`localStorage.setItem('release', 0)`);
    await waitForElement(window, '//div[2]/span');
    await clickElement(window, '.planet-bar__button__fly > img', {}, 'css');
    await clickElement(window, '.-list > .mdc-list-item:nth-child(1) > .mdc-list-item__text', {}, 'css');
    await waitForElementInFrameByIndex(window, 1, "xpath", `//b[contains(., "${planet}")]`, "notRequired");
    await waitForElementInFrameByIndex(window, 1, "css", `.button-decor3 > .button__wrapper`, "required");
    await waitForElementInFrameByIndex(window, 1, "xpath", `//b[contains(., "${planet}")]`, "notRequired");
    await waitForElementInFrameByIndex(window, 2, "css", `.button__wrapper`, "reloadRequired");
    }
  }catch(error){
    console.log(error);
  }
}

async function updateRivalAndTime(mainWindow, planet) {
  try {
    // Execute tasks in parallel
    const [localStorageResult, fileContent, checkPlanetVar] = await Promise.all([
      mainWindow.webContents.executeJavaScript('localStorage.getItem("loopTime")'),
      fs.promises.readFile("/Electron/control.sh", 'utf-8'),
      checkPlanet(mainWindow, planet),
    ]);

    // Extract results
    const count = localStorageResult;
    const lines = fileContent.split('\n');
    const rival = lines[1].trim().split(/\s+/);
    const time = lines[2];

    // Return the results if needed
    return { count, rival, time, checkPlanetVar };
  } catch (error) {
    console.error('Error:', error.message);
    // Handle the error or propagate it further
    throw error;
  }
}

async function waitingTime(auto, time, timediff, Diff){
  if (auto === "true"){
        console.log(auto)
        console.log(time)
        console.log(timediff)
        timediff = time - Diff
        await sleep(timediff/2);
        console.log("Waiting times"+timediff);
      }else{
        await sleep(time);
        console.log("Waiting time"+time);
      }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.whenReady().then(createWindow);
