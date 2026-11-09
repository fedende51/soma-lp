import {createRequire} from 'node:module';
import fs from 'node:fs';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const stage=process.argv[2]||'after';fs.mkdirSync(`artifacts/${stage}`,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{for(const [name,width,height]of[['desktop',1440,1000],['tablet',768,1024],['mobile',390,844]]){const page=await browser.newPage({viewport:{width,height}});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});for(const el of await page.locator('.reveal').all())await el.scrollIntoViewIfNeeded();await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`artifacts/${stage}/${name}.png`,fullPage:true});await page.screenshot({path:`artifacts/${stage}/${name}-top.png`});console.log(`${stage}/${name}: ${await page.title()}`);await page.close();}}finally{await browser.close();}
