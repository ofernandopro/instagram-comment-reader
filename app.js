const puppeteer = require('puppeteer')

// Read Instagram Page

async function start() {

    async function loadMore(page, selector) {
        const moreButton = await page.$(selector)
        if (moreButton) {
            console.log("More")
            await moreButton.click()
            await page.waitFor(selector, { timeout: 3000 }).catch(() => { console.log("timeout") })
            await loadMore(page, selector)
        }
    }

    // Get comments/Profile Links
    async function getComments(page, selector) {
        const comments = await page.$$eval(selector, links => links.map(link => link.innerText))
        return comments
    }

    const browser = await puppeteer.launch() // The code will continue only when launch has finished running
    const page = await browser.newPage()
    await page.goto('https://www.instagram.com/p/CChMVvQgYKK/')

    await loadMore(page, '.dCJp8');
    const comments = await getComments(page, '.C4VMK span a');
    const counted = count(comments)
    const sorted = sort(counted)
    sorted.forEach(arroba => { console.log(arroba) })

    await browser.close()

}

// Count repeated signs

function count(profileLinks) {
    const count = {}
    profileLinks.forEach(profileLinks => { count[profileLinks] = (count[profileLinks] || 0) + 1 })
    return count
}

// console.log(count(fakeProfileLinks))

// Sort

function sort(counted) {
    // Building an array of fakeProfileLink type object:
    const entries = Object.entries(counted)

    // Sorting this array by the number of profile links:
    const sorted = entries.sort((a, b) => b[1] - a[1])

    return sorted
}

start()