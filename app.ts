import puppeteer from 'puppeteer';

interface Icount {
  [key: string]: number
}

async function start() {
  async function loadComments(page: any, selector: string) {
    const button = await page.$(selector);
    if(button) {
      console.log('More')
      await button.click();
      await page.waitFor(selector, { timeout: 3000 }).catch(() => console.log('Timeout'));
      await loadComments(page, selector);
    }
  }

  async function getComments(page: any, selector: string) {
    const comments = await page.$$eval(selector, (links: any) => links.map((link: any) => link.innerText));
    return comments;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/p/CChMVvQgYKK/');
  await loadComments(page, '.dCJp8');
  const comments = await getComments(page, '.C4VMK span a');
  const counted = count(comments);
  const sorted = sort(counted);
  sorted.forEach((arroba: any) => console.log(arroba));
}

function count(arrobas: any) {
  const count: Icount = {};
  arrobas.forEach((arroba: keyof typeof count) => { count[arroba] = (count[arroba] || 0) + 1 });
  return count;
}

function sort(counted: Object){
  const entries = Object.entries(counted).sort((a, b) => b[1] - a[1]);
  return entries;
}

start();