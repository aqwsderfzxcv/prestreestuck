function prestigeButtonText(layer) {
	if (layers[layer].prestigeButtonText !== undefined)
		return run(layers[layer].prestigeButtonText(), layers[layer])
	if (tmp[layer].type == "normal")
		return `${player[layer].points.lt(1e3) ? (tmp[layer].resetDescription !== undefined ? tmp[layer].resetDescription : "Reset for ") : ""}+<b>${formatWhole(tmp[layer].resetGain)}</b> ${tmp[layer].resource} ${tmp[layer].resetGain.lt(100) && player[layer].points.lt(1e3) ? `<br><br>Next at ${(tmp[layer].roundUpCost ? formatWhole(tmp[layer].nextAt) : format(tmp[layer].nextAt))} ${tmp[layer].baseResource}` : ""}`
	if (tmp[layer].type == "static")
		return `${tmp[layer].resetDescription !== undefined ? tmp[layer].resetDescription : "Reset for "}+<b>${formatWhole(tmp[layer].resetGain)}</b> ${tmp[layer].resource}<br><br>${player[layer].points.lt(30) ? (tmp[layer].baseAmount.gte(tmp[layer].nextAt) && (tmp[layer].canBuyMax !== undefined) && tmp[layer].canBuyMax ? "Next:" : "Req:") : ""} ${formatWhole(tmp[layer].baseAmount)} / ${(tmp[layer].roundUpCost ? formatWhole(tmp[layer].nextAtDisp) : format(tmp[layer].nextAtDisp))} ${tmp[layer].baseResource}		
		`
	if (tmp[layer].type == "none")
		return ""
    
        return "You need prestige button text"
}

function constructNodeStyle(layer){
	let style = []
	if ((tmp[layer].isLayer && layerunlocked(layer)) || (!tmp[layer].isLayer && tmp[layer].canClick))
		style.push({'background-color': tmp[layer].color})
	if (tmp[layer].image !== undefined)
		style.push({'background-image': 'url("' + tmp[layer].image + '")'})
	if(tmp[layer].notify && player[layer].unlocked)
		style.push({'box-shadow': 'var(--hqProperty2a), 0 0 20px ' + tmp[layer].trueGlowColor})
	style.push(tmp[layer].nodeStyle)
    return style
}

function challengeStyle(layer, id) {
	if (player[layer].activeChallenge == id && canCompleteChallenge(layer, id)) return "canComplete"
	else if (maxedChallenge(layer, id)) return "done"
    return "locked"
}

function challengeButtonText(layer, id) {
    return (player[layer].activeChallenge==(id)?(canCompleteChallenge(layer, id)?"Finish":"Exit Early"):(maxedChallenge(layer, id)?"Completed":"Start"))

}

function achievementStyle(layer, id){
    ach = tmp[layer].achievements[id]
    let style = []
    if (ach.image){ 
        style.push({'background-image': 'url("' + ach.image + '")'})
    } 
    if (!ach.unlocked) style.push({'visibility': 'hidden'})
    style.push(ach.style)
    return style
}




function updateWidth() {
	var screenWidth = window.innerWidth
	var splitScreen = screenWidth >= 1024
	if (meta.options.splitMode === "disabled") splitScreen = false
	if (meta.options.splitMode === "enabled") splitScreen = true


	tmp.other.screenWidth = screenWidth
	tmp.other.splitScreen = splitScreen
	tmp.other.lastPoints = player.points
}

function updateOomps(diff)
{
	tmp.other.oompsMag = 0
	if (player.points.lte(new Decimal(1e100))) return

	var pp = new Decimal(player.points);
	var lp = tmp.other.lastPoints || new Decimal(0);
	if (pp.gt(lp)) {
		if (pp.gte("10^^8")) {
			pp = pp.slog(1e10)
			lp = lp.slog(1e10)
			tmp.other.oomps = pp.sub(lp).div(diff)
			tmp.other.oompsMag = -1;
		} else {
			while (pp.div(lp).log(10).div(diff).gte("100") && tmp.other.oompsMag <= 5 && lp.gt(0)) {
				pp = pp.log(10)
				lp = lp.log(10)
				tmp.other.oomps = pp.sub(lp).div(diff)
				tmp.other.oompsMag++;
			}
		}
	}

}