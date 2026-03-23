const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replacements in HTML
const htmlReplacements = [
    [/Singelspelare\s*vs CPU/g, '<span data-i18n="SINGEL">Singelspelare vs CPU</span>'],
    [/Lokal\s*Duo/g, '<span data-i18n="DUO">Lokal Duo</span>'],
    [/Galaktisk\s*Online/g, '<span data-i18n="ONLINE">Galaktisk Online</span>'],
    [/>PÅGÅENDE SPEL</g, ' data-i18n="ACTIVE">PÅGÅENDE SPEL<'],
    [/>Pågående Spel</g, ' data-i18n="MATCHES">Pågående Spel<'],
    [/placeholder="DITT NICKNAME"/g, 'placeholder="DITT NICKNAME" data-i18n="NICK_PH"'],
    [/>Terminal</g, ' data-i18n="TERM">Terminal<'],
    [/>Skapa\s*Sändning</g, ' data-i18n="CREATE">Skapa Sändning<'],
    [/placeholder="SKRIV IN MATCH-ID"/g, 'placeholder="SKRIV IN MATCH-ID" data-i18n="ID_PH"'],
    [/>Anslut\s*till ID</g, ' data-i18n="JOIN">Anslut till ID<'],
    [/>TILLBAKA</g, ' data-i18n="BACK">TILLBAKA<'],
    [/>&larr; Meny</g, ' data-i18n="MENU">&larr; Meny<'],
    [/>SÄNDNINGS-FREKVENS</g, ' data-i18n="FREQ">SÄNDNINGS-FREKVENS<'],
    [/>Svart</g, ' data-i18n="BLACK">Svart<'],
    [/>Vit</g, ' data-i18n="WHITE">Vit<'],
    [/>Abort\s*Mission</g, ' data-i18n="ABORT">Abort Mission<'],
    [/>Ge upp\?</g, ' data-i18n="GIVEUP">Ge upp?<'],
    [/>Flyr du fältet nu\? Galaxen kommer aldrig\s*att glömma detta ögonblick av feghet\.</g, ' data-i18n="FLEE">Flyr du fältet nu? Galaxen kommer aldrig att glömma detta ögonblick av feghet.<'],
    [/>Stanna och\s*slåss</g, ' data-i18n="STAY">Stanna och slåss<'],
    [/>Ja,\s*jag flyr!</g, ' data-i18n="YES_FLEE">Ja, jag flyr!<'],
    [/>Mission\s*Over</g, ' data-i18n="GAMEOVER">Mission Over<'],
    [/>Back\s*to Command</g, ' data-i18n="BACKCMD">Back to Command<']
];

for (const [regex, replacement] of htmlReplacements) {
    content = content.replace(regex, replacement);
}

// Remove ID-DNA
content = content.replace(
    /<div class="pt-8 border-t border-white\/10">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
    `<div class="pt-8 border-t border-white/10 flex justify-center gap-4">
                <button id="toggle-stars-btn" onclick="toggleStars()" class="text-[10px] text-emerald-400/60 hover:text-emerald-400 uppercase font-black tracking-[0.2em] bg-black/40 px-4 py-2 rounded-xl transition-all border border-emerald-500/30">STANNA STJÄRNOR</button>
                <button onclick="toggleLang()" class="text-[10px] text-emerald-400/60 hover:text-emerald-400 uppercase font-black tracking-[0.2em] bg-black/40 px-4 py-2 rounded-xl transition-all border border-emerald-500/30">SV / EN</button>
            </div>
        </div>
    </div>`
);

// Inject JS
const jsInject = `
        let currentLang = localStorage.getItem('reversi_lang') || 'sv';
        const DICT = {
            'sv': {
                'SINGEL': 'Singelspelare vs CPU', 'DUO': 'Lokal Duo', 'ONLINE': 'Galaktisk Online', 'ACTIVE': 'PÅGÅENDE SPEL', 'BACK': 'TILLBAKA',
                'TERM': 'Terminal', 'NICK_PH': 'DITT NICKNAME', 'CREATE': 'Skapa Sändning', 'ID_PH': 'SKRIV IN MATCH-ID', 'JOIN': 'Anslut till ID',
                'MATCHES': 'Pågående Spel', 'NO_MATCHES': 'INGA PÅGÅENDE SPEL', 'SCANNING': 'Söker genom galaxen...',
                'MENU': '← Meny', 'FREQ': 'SÄNDNINGS-FREKVENS', 'WAITING': 'VÄNTAR', 'ABORT': 'Abort Mission', 'GIVEUP': 'Ge upp?',
                'FLEE': 'Flyr du fältet nu? Galaxen kommer aldrig att glömma detta ögonblick av feghet.', 'STAY': 'Stanna och slåss', 'YES_FLEE': 'Ja, jag flyr!',
                'GAMEOVER': 'Mission Over', 'BACKCMD': 'Back to Command', 'STOP_STARS': 'STANNA STJÄRNOR', 'START_STARS': 'RÖRLIGA STJÄRNOR',
                'BLACK': 'SVART', 'WHITE': 'VIT', 'SEARCHING': 'SÖKER MOTSTÅNDARE', 'YOUR_TURN': 'DIN TUR', 'BLACK_TURN': 'SVART TUR',
                'WHITE_TURN': 'VIT TUR', 'CPU_THINK': 'XENO TÄNKER', 'ABORTED': 'AVBRUTEN', 'COWARD': 'Du övergav din post!', 'OPP_FLED': 'Din motståndare har övergett spelet',
                'REMI': 'REMI', 'EARTH_WIN': 'JORDEN SEGRADE', 'XENO_WIN': 'XENO SEGRADE', 'DARK_DOM': 'Mörkrets kraft dominerar.', 'LIGHT_WIN': 'Ljuset segrade galaxen.',
                'NO_WIN': 'Ingen vann stjärnornas krig.', 'EARTH_SAFE': 'Mörkret har skingrats. Galaxen är säker.', 'PACK_BAGS': 'Xeno-imperiet vann. Packa dina väskor.',
                'DEAD_HEAT': 'Ett dött lopp i rymden.', 'ERR_NICK': 'SKRIV IN DITT NICKNAME', 'ERR_FB': 'FIREBASE SAKNAS', 'ERR_ID': 'SKRIV IN ID',
                'ERR_FULL': 'SEKTORN ÄR FULL', 'ERR_MISS': 'ID SAKNAS', 'ERR_CONN': 'ANSLUTNINGSFEL', 'ERR_BROAD': 'SÄNDNING MISSLYCKADES',
                'ERR_SYSTEM': 'SYSTEMFEL: FIREBASE', 'ERR_DENIED': 'ÅTKOMST NEKAD', 'ERR_RADIO': 'KOSMISK RADIOSKUGGA', 'COPIED': 'FREKVENS KOPIERAD',
                'NOTIF_TURN': 'Det är din tur att göra ett drag!', 'NOTIF_FLED': 'Din motståndare fegade ur och gav upp!', 'TOAST_FLED': 'MOTSTÅNDAREN GAV UPP!',
                'SIGNAL_ERR': 'SIGNALSTÖRNING'
            },
            'en': {
                'SINGEL': 'Singleplayer vs CPU', 'DUO': 'Local Duo', 'ONLINE': 'Galactic Online', 'ACTIVE': 'ACTIVE GAMES', 'BACK': 'BACK',
                'TERM': 'Terminal', 'NICK_PH': 'YOUR NICKNAME', 'CREATE': 'Create Broadcast', 'ID_PH': 'ENTER MATCH ID', 'JOIN': 'Join by ID',
                'MATCHES': 'Active Matches', 'NO_MATCHES': 'NO ACTIVE MATCHES', 'SCANNING': 'Scanning the galaxy...',
                'MENU': '← Menu', 'FREQ': 'BROADCAST FREQUENCY', 'WAITING': 'WAITING', 'ABORT': 'Abort Mission', 'GIVEUP': 'Give up?',
                'FLEE': 'Fleeing the field? The galaxy will never forget this moment of cowardice.', 'STAY': 'Stay and fight', 'YES_FLEE': 'Yes, I flee!',
                'GAMEOVER': 'Mission Over', 'BACKCMD': 'Back to Command', 'STOP_STARS': 'FREEZE STARS', 'START_STARS': 'UNFREEZE STARS',
                'BLACK': 'BLACK', 'WHITE': 'WHITE', 'SEARCHING': 'SEARCHING FOR OPPONENT', 'YOUR_TURN': 'YOUR TURN', 'BLACK_TURN': 'BLACK TURN',
                'WHITE_TURN': 'WHITE TURN', 'CPU_THINK': 'XENO THINKING', 'ABORTED': 'ABORTED', 'COWARD': 'You abandoned your post!', 'OPP_FLED': 'Your opponent abandoned the game',
                'REMI': 'DRAW', 'EARTH_WIN': 'EARTH VICTORIOUS', 'XENO_WIN': 'XENO VICTORIOUS', 'DARK_DOM': 'The power of darkness dominates.', 'LIGHT_WIN': 'The light conquered the galaxy.',
                'NO_WIN': 'Nobody won the star wars.', 'EARTH_SAFE': 'The darkness is dispersed. The galaxy is safe.', 'PACK_BAGS': 'Xeno-empire won. Pack your bags.',
                'DEAD_HEAT': 'A dead heat in space.', 'ERR_NICK': 'ENTER YOUR NICKNAME', 'ERR_FB': 'FIREBASE MISSING', 'ERR_ID': 'ENTER ID',
                'ERR_FULL': 'SECTOR IS FULL', 'ERR_MISS': 'ID MISSING', 'ERR_CONN': 'CONNECTION ERROR', 'ERR_BROAD': 'BROADCAST FAILED',
                'ERR_SYSTEM': 'SYSTEM ERROR: FIREBASE', 'ERR_DENIED': 'ACCESS DENIED', 'ERR_RADIO': 'COSMIC RADIO SHADOW', 'COPIED': 'FREQUENCY COPIED',
                'NOTIF_TURN': 'It is your turn to make a move!', 'NOTIF_FLED': 'Your opponent chickened out and gave up!', 'TOAST_FLED': 'OPPONENT GAVE UP!',
                'SIGNAL_ERR': 'SIGNAL INTERFERENCE'
            }
        };

        function t(key) { return DICT[currentLang][key] || key; }

        function toggleLang() {
            currentLang = currentLang === 'sv' ? 'en' : 'sv';
            localStorage.setItem('reversi_lang', currentLang);
            applyLang();
            if (gameMode !== 'online') {
                const p1L = getSafeEl('p1-label'), p2L = getSafeEl('p2-label');
                if (p1L && !isOnlineMatchFull) p1L.innerText = t('BLACK');
                if (p2L && !isOnlineMatchFull) p2L.innerText = t('WHITE');
            }
            updateTurnIndicator();
            const cm = getEl('confirm-modal'), mb = getEl('message-box');
            if (cm && !cm.classList.contains('hidden') && abortedBy) { endGame(); }
            if (mb && !mb.classList.contains('hidden')) { endGame(); }
        }

        function applyLang() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (el.tagName === 'INPUT') el.placeholder = t(key);
                else {
                    if(el.children.length > 0) el.innerHTML = t(key);
                    else el.innerText = t(key);
                }
            });
            const btn = getSafeEl('toggle-stars-btn');
            if (btn) btn.innerText = starsMoving ? t('STOP_STARS') : t('START_STARS');
        }
        
        let starsMoving = true;
        function toggleStars() {
            starsMoving = !starsMoving;
            const btn = getSafeEl('toggle-stars-btn');
            if (btn) btn.innerText = starsMoving ? t('STOP_STARS') : t('START_STARS');
        }

`;
content = content.replace(/const getEl = \(id\) => document.getElementById\(id\);/, "const getEl = (id) => document.getElementById(id);\n" + jsInject);

// update animateStation
content = content.replace(
    /function animateStation\(\) \{[\s\S]*?renderer\.render\(scene, camera\);\s*\}/,
    `function animateStation() {
            requestAnimationFrame(animateStation);
            if (stationGroup && starsMoving) {
                stationGroup.rotation.y += 0.003;
                stationGroup.rotation.z = Math.sin(Date.now() * 0.0003) * 0.1;
            }
            if (starField && starsMoving) {
                starField.rotation.y += 0.0002;
            }
            renderer.render(scene, camera);
        }`
);

// We need to replace string literals with t('KEY') dynamically where needed:
const jsReplacements = [
    [/"SÖKER MOTSTÅNDARE"/g, "t('SEARCHING')"],
    [/"DIN TUR"/g, "t('YOUR_TURN')"],
    [/"VÄNTAR"/g, "t('WAITING')"],
    [/"SVART TUR"/g, "t('BLACK_TURN')"],
    [/"XENO TÄNKER"/g, "t('CPU_THINK')"],
    [/"VIT TUR"/g, "t('WHITE_TURN')"],
    [/"AVBRUTEN"/g, "t('ABORTED')"],
    [/"Du övergav din post!"/g, "t('COWARD')"],
    [/"Din motståndare har övergett spelet"/g, "t('OPP_FLED')"],
    [/"JORDEN SEGRADE"/g, "t('EARTH_WIN')"],
    [/"XENO SEGRADE"/g, "t('XENO_WIN')"],
    [/"REMI"/g, "t('REMI')"],
    [/"Mörkret har skingrats\. Galaxen är säker\."/g, "t('EARTH_SAFE')"],
    [/"Xeno-imperiet vann\. Packa dina väskor\."/g, "t('PACK_BAGS')"],
    [/"Ett dött lopp i rymden\."/g, "t('DEAD_HEAT')"],
    [/"Mörkrets kraft dominerar\."/g, "t('DARK_DOM')"],
    [/"Ljuset segrade galaxen\."/g, "t('LIGHT_WIN')"],
    [/"Ingen vann stjärnornas krig\."/g, "t('NO_WIN')"],
    [/"SKRIV IN DITT NICKNAME!"/g, "t('ERR_NICK')"],
    [/"SKRIV IN ID"/g, "t('ERR_ID')"],
    [/"SEKTORN ÄR FULL"/g, "t('ERR_FULL')"],
    [/"ID SAKNAS"/g, "t('ERR_MISS')"],
    [/"ANSLUTNINGSFEL"/g, "t('ERR_CONN')"],
    [/"SÄNDNING MISSLYCKADES"/g, "t('ERR_BROAD')"],
    [/"FIREBASE SAKNAS"/g, "t('ERR_FB')"],
    [/"ÅTKOMST NEKAD"/g, "t('ERR_DENIED')"],
    [/"KOSMISK RADIOSKUGGA"/g, "t('ERR_RADIO')"],
    [/"SYSTEMFEL: FIREBASE"/g, "t('ERR_SYSTEM')"],
    [/"FREKVENS KOPIERAD"/g, "t('COPIED')"],
    [/"MOTSTÅNDAREN GAV UPP!"/g, "t('TOAST_FLED')"],
    [/"SIGNALSTÖRNING"/g, "t('SIGNAL_ERR')"],
    [/"Det är din tur att göra ett drag!"/g, "t('NOTIF_TURN')"],
    [/"Din motståndare fegade ur och gav upp!"/g, "t('NOTIF_FLED')"],
    [/'SVART'/g, "t('BLACK')"],
    [/'VIT'/g, "t('WHITE')"]
];

for (const [regex, replacement] of jsReplacements) {
    content = content.replace(regex, replacement);
}

// Add applyLang() to the end of initStation3D so it translates on start
content = content.replace(/animateStation\(\);\s*\}/, "animateStation();\n            applyLang();\n        }");

// Handle matches-list injection
content = content.replace(/<div class="text-white\/50 text-sm italic py-4">Söker genom galaxen\.\.\.<\/div>/, "`<div class=\"text-white/50 text-sm italic py-4\">${t('SCANNING')}</div>`");
content = content.replace(/<div class="text-gray-400 text-sm font-black py-4">INGA PÅGÅENDE SPEL<\/div>/, "`<div class=\"text-gray-400 text-sm font-black py-4\">${t('NO_MATCHES')}</div>`");

// Ensure User ID display logic is removed from Auth module since we removed the HTML
content = content.replace(/const display = getEl\('user-id-display'\);[\s\S]*?display\.innerText = [^;]+;/g, "");

fs.writeFileSync('index.html', content);
