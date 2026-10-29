// =============================================
// FloodGuard - Taman Sri Muda
// Real boundary + Evacuation Routes
// =============================================

// ACTUAL OSM boundary of Taman Sri Muda (59 points from Nominatim)
const TSM_BOUNDARY = [
    [3.0298265, 101.5253153],[3.029564,  101.525715],
    [3.0295238, 101.5285984],[3.0272042, 101.5298335],
    [3.0273676, 101.5301621],[3.0234865, 101.5321845],
    [3.0233419, 101.5319297],[3.0216397, 101.5329033],
    [3.0217991, 101.5331755],[3.0222893, 101.5331742],
    [3.0222793, 101.5333943],[3.022225,  101.5351161],
    [3.0213839, 101.5354044],[3.0204853, 101.5358993],
    [3.0236981, 101.5416312],[3.029347,  101.5416741],
    [3.0297059, 101.5418297],[3.0299256, 101.5420255],
    [3.0301773, 101.5423205],[3.0303581, 101.5426303],
    [3.0304572, 101.5428422],[3.0306353, 101.543321],
    [3.0306862, 101.5437689],[3.030697,  101.5451154],
    [3.0306541, 101.5453327],[3.0301666, 101.5464511],
    [3.030747,  101.5466687],[3.0307612, 101.5466313],
    [3.0309487, 101.5461373],[3.0312487, 101.5454668],
    [3.0314148, 101.5451208],[3.0317683, 101.5445173],
    [3.0319558, 101.5442491],[3.0321192, 101.544131],
    [3.0324379, 101.5439594],[3.0329201, 101.5438226],
    [3.0333004, 101.5437851],[3.0335281, 101.5437528],
    [3.0347736, 101.5421569],[3.0349316, 101.5410961],
    [3.0353039, 101.5411833],[3.036994,  101.5383562],
    [3.0371547, 101.5384528],[3.0374252, 101.538021],
    [3.0379502, 101.5363017],[3.0377252, 101.535961],
    [3.0379877, 101.5347728],[3.0375538, 101.5343115],
    [3.0376636, 101.5339306],[3.0382636, 101.5335363],
    [3.0385582, 101.5323508],[3.0386225, 101.5314522],
    [3.0383948, 101.5297356],[3.0377104, 101.5296892],
    [3.0355637, 101.5272975],[3.0355583, 101.5259188],
    [3.0350012, 101.5254065],[3.0298961, 101.5253165],
    [3.0298265, 101.5253153]
];

// ---- Real PPS (Pusat Pemindahan Sementara) Locations ----
const PPS_LOCATIONS = [
    {
        id: 'pps1',
        name: 'Dewan Azalea Seksyen 25',
        shortName: 'Dewan Azalea (At Risk)',
        coords: [3.0336, 101.5367],
        capacity: 500,
        current_pax: 450,
        type: 'secondary',
        note: '⚠️ Low-lying internal facility — at risk of deep inundation. Directed to Dewan MBSA Sek 28'
    },
    {
        id: 'pps2',
        name: 'SK Taman Sri Muda',
        shortName: 'SK Sri Muda (At Risk)',
        coords: [3.0315, 101.5398],
        capacity: 800,
        current_pax: 200,
        type: 'secondary',
        note: '⚠️ Low-lying internal school — at risk of deep inundation. Directed to Dewan MBSA Sek 28'
    },
    {
        id: 'pps3',
        name: 'Dewan Kenangan MBSA, Seksyen 28',
        shortName: 'Dewan MBSA Sek28',
        coords: [3.0487, 101.5421],
        capacity: 1200,
        current_pax: 1100,
        type: 'primary',
        note: '✅ Primary High-Ground Relief Centre — safe, elevated & fully accessible from north exits'
    },
    {
        id: 'pps4',
        name: 'SK Seksyen 16 Shah Alam',
        shortName: 'SK Seksyen 16',
        coords: [3.0576, 101.5189],
        capacity: 1000,
        current_pax: 350,
        type: 'primary',
        note: '✅ Primary High-Ground Relief Centre — safe & elevated via LKSA Highway corridor'
    }
];

// ---- Evacuation Zones within TSM ----
// Each zone has a colour, label, assigned PPS, and real turn-by-turn road network routes
// Safe routing policy: corridors ALWAYS route AWAY from low-lying red zones to elevated external PPS
const EVAC_ZONES = [
    {
        id: "zone-north",
        name: "North Zone",
        color: "#7c3aed",
        centroid: [3.0375, 101.534],
        ppsId: "pps3", // → Dewan MBSA Sek28 (north exit via Persiaran Budiman)
        route: [[3.037504, 101.534103], [3.038333, 101.534074], [3.039675, 101.534058], [3.040804, 101.534018], [3.041617, 101.534017], [3.041698, 101.534014], [3.041873, 101.534009], [3.042356, 101.533998], [3.042671, 101.533992], [3.042754, 101.53399], [3.043569, 101.533942], [3.04397, 101.533861], [3.044021, 101.533842], [3.044066, 101.533801], [3.044128, 101.533712], [3.044169, 101.532828], [3.044206, 101.532038], [3.044218, 101.531799], [3.04422, 101.531738], [3.044328, 101.531745], [3.044677, 101.531766], [3.047936, 101.532036], [3.048321, 101.532068], [3.048386, 101.532115], [3.04841, 101.532159], [3.048447, 101.532251], [3.048381, 101.532845], [3.048342, 101.533379], [3.048319, 101.533788], [3.048297, 101.534369], [3.048284, 101.535019], [3.04832, 101.53542], [3.048341, 101.5356], [3.048426, 101.535952], [3.048515, 101.536193], [3.048596, 101.536413], [3.048806, 101.536794], [3.04919, 101.537394], [3.049927, 101.538542], [3.050368, 101.539267], [3.050475, 101.539433], [3.051462, 101.540911], [3.052123, 101.54193], [3.052443, 101.542649], [3.052534, 101.542814], [3.052577, 101.542893], [3.05264, 101.542996], [3.052741, 101.543069], [3.052896, 101.543105], [3.053036, 101.543181], [3.053163, 101.543306], [3.053247, 101.543463], [3.053281, 101.543638], [3.053262, 101.543815], [3.053199, 101.543967], [3.053098, 101.544095], [3.052971, 101.544188], [3.052825, 101.544245], [3.052668, 101.544261], [3.052563, 101.544249], [3.052461, 101.544218], [3.052366, 101.544169], [3.052226, 101.544046], [3.052131, 101.543885], [3.05209, 101.543703], [3.052107, 101.543517], [3.052167, 101.543367], [3.052266, 101.543239], [3.052318, 101.543114], [3.052345, 101.542974], [3.052355, 101.542846], [3.052342, 101.542785], [3.052323, 101.542694], [3.052087, 101.542186], [3.051795, 101.541639], [3.051268, 101.540867], [3.051081, 101.540749], [3.050995, 101.540718], [3.050925, 101.540717], [3.050876, 101.540732], [3.050225, 101.54111], [3.050016, 101.54123], [3.049479, 101.54154], [3.049342, 101.5416], [3.04922, 101.541619], [3.049081, 101.541642], [3.048796, 101.541634]]
    },
    {
        id: "zone-east",
        name: "East Zone",
        color: "#0891b2",
        centroid: [3.0298, 101.5418],
        ppsId: "pps3", // → Dewan MBSA Sek28 (safe exit via Persiaran Aman & Jalan Masyhur 25/50, strictly on road away from Klang River)
        route: [[3.029704, 101.541968], [3.029944, 101.542158], [3.030015, 101.542231], [3.030175, 101.542399], [3.030398, 101.542816], [3.030655, 101.542703], [3.030945, 101.542577], [3.031423, 101.542368], [3.031602, 101.54229], [3.03137, 101.541752], [3.031464, 101.541708], [3.031704, 101.542267], [3.031868, 101.542195], [3.032291, 101.542008], [3.032506, 101.541913], [3.032724, 101.541817], [3.033149, 101.541629], [3.032861, 101.540954], [3.03281, 101.540834], [3.032439, 101.540755], [3.032332, 101.540751], [3.031464, 101.541126], [3.032332, 101.540751], [3.032439, 101.540755], [3.032507, 101.540769], [3.03281, 101.540834], [3.032778, 101.540759], [3.032838, 101.540741], [3.033035, 101.540773], [3.033419, 101.541023], [3.033649, 101.541174], [3.033878, 101.541211], [3.034262, 101.541272], [3.034334, 101.541284], [3.034815, 101.541361], [3.034942, 101.540884], [3.034956, 101.54083], [3.035014, 101.540608], [3.035051, 101.540469], [3.035136, 101.540145], [3.035191, 101.539933], [3.035226, 101.539802], [3.035242, 101.539739], [3.035297, 101.539752], [3.03547, 101.539793], [3.035687, 101.539844], [3.0355, 101.5398], [3.03547, 101.539793], [3.035297, 101.539752], [3.035242, 101.539739], [3.035255, 101.539689], [3.035367, 101.539261], [3.035398, 101.539142], [3.035484, 101.538817], [3.035584, 101.538435], [3.035297, 101.53838], [3.035076, 101.538337], [3.034868, 101.538297], [3.034617, 101.538249], [3.034391, 101.538205], [3.034268, 101.538181], [3.034149, 101.538171], [3.03391, 101.538151], [3.033668, 101.538131], [3.033407, 101.538109], [3.03311, 101.538084], [3.032905, 101.538055], [3.032972, 101.537624], [3.032988, 101.537242], [3.032871, 101.536433], [3.032751, 101.535699], [3.032724, 101.535533], [3.03268, 101.535265], [3.032659, 101.535141], [3.032609, 101.534986], [3.032554, 101.534879], [3.032481, 101.534793], [3.032423, 101.534699], [3.032348, 101.534655], [3.032272, 101.534555], [3.032248, 101.534432], [3.032282, 101.534311], [3.03231, 101.534269], [3.032404, 101.534196], [3.032519, 101.534169], [3.032636, 101.534193], [3.032725, 101.534258], [3.0328, 101.53431], [3.032967, 101.534343], [3.035283, 101.534227], [3.036979, 101.534121], [3.0375, 101.534103], [3.038333, 101.534074], [3.039675, 101.534058], [3.040804, 101.534018], [3.041617, 101.534017], [3.041698, 101.534014], [3.041873, 101.534009], [3.042356, 101.533998], [3.042671, 101.533992], [3.042754, 101.53399], [3.043569, 101.533942], [3.04397, 101.533861], [3.044021, 101.533842], [3.044066, 101.533801], [3.044128, 101.533712], [3.044169, 101.532828], [3.044206, 101.532038], [3.044218, 101.531799], [3.04422, 101.531738], [3.044328, 101.531745], [3.044677, 101.531766], [3.047936, 101.532036], [3.048321, 101.532068], [3.048386, 101.532115], [3.04841, 101.532159], [3.048447, 101.532251], [3.048381, 101.532845], [3.048342, 101.533379], [3.048319, 101.533788], [3.048297, 101.534369], [3.048284, 101.535019], [3.04832, 101.53542], [3.048341, 101.5356], [3.048426, 101.535952], [3.048515, 101.536193], [3.048596, 101.536413], [3.048806, 101.536794], [3.04919, 101.537394], [3.049927, 101.538542], [3.050368, 101.539267], [3.050475, 101.539433], [3.051462, 101.540911], [3.052123, 101.54193], [3.052443, 101.542649], [3.052534, 101.542814], [3.052577, 101.542893], [3.05264, 101.542996], [3.052741, 101.543069], [3.052896, 101.543105], [3.053036, 101.543181], [3.053163, 101.543306], [3.053247, 101.543463], [3.053281, 101.543638], [3.053262, 101.543815], [3.053199, 101.543967], [3.053098, 101.544095], [3.052971, 101.544188], [3.052825, 101.544245], [3.052668, 101.544261], [3.052563, 101.544249], [3.052461, 101.544218], [3.052366, 101.544169], [3.052226, 101.544046], [3.052131, 101.543885], [3.05209, 101.543703], [3.052107, 101.543517], [3.052167, 101.543367], [3.052266, 101.543239], [3.052318, 101.543114], [3.052345, 101.542974], [3.052355, 101.542846], [3.052342, 101.542785], [3.052323, 101.542694], [3.052087, 101.542186], [3.051795, 101.541639], [3.051268, 101.540867], [3.051081, 101.540749], [3.050995, 101.540718], [3.050925, 101.540717], [3.050876, 101.540732], [3.050225, 101.54111], [3.050016, 101.54123], [3.049479, 101.54154], [3.049342, 101.5416], [3.04922, 101.541619], [3.049081, 101.541642], [3.048796, 101.541634]]
    },
    {
        id: "zone-center",
        name: "Central Zone",
        color: "#059669",
        centroid: [3.0330, 101.5342],
        ppsId: "pps3", // → Dewan MBSA Sek28 (immediate north exit via Persiaran Budiman out of basin)
        route: [[3.033007, 101.534341], [3.035283, 101.534227], [3.036979, 101.534121], [3.0375, 101.534103], [3.038333, 101.534074], [3.039675, 101.534058], [3.040804, 101.534018], [3.041617, 101.534017], [3.041698, 101.534014], [3.041873, 101.534009], [3.042356, 101.533998], [3.042671, 101.533992], [3.042754, 101.53399], [3.043569, 101.533942], [3.04397, 101.533861], [3.044021, 101.533842], [3.044066, 101.533801], [3.044128, 101.533712], [3.044169, 101.532828], [3.044206, 101.532038], [3.044218, 101.531799], [3.04422, 101.531738], [3.044328, 101.531745], [3.044677, 101.531766], [3.047936, 101.532036], [3.048321, 101.532068], [3.048386, 101.532115], [3.04841, 101.532159], [3.048447, 101.532251], [3.048381, 101.532845], [3.048342, 101.533379], [3.048319, 101.533788], [3.048297, 101.534369], [3.048284, 101.535019], [3.04832, 101.53542], [3.048341, 101.5356], [3.048426, 101.535952], [3.048515, 101.536193], [3.048596, 101.536413], [3.048806, 101.536794], [3.04919, 101.537394], [3.049927, 101.538542], [3.050368, 101.539267], [3.050475, 101.539433], [3.051462, 101.540911], [3.052123, 101.54193], [3.052443, 101.542649], [3.052534, 101.542814], [3.052577, 101.542893], [3.05264, 101.542996], [3.052741, 101.543069], [3.052896, 101.543105], [3.053036, 101.543181], [3.053163, 101.543306], [3.053247, 101.543463], [3.053281, 101.543638], [3.053262, 101.543815], [3.053199, 101.543967], [3.053098, 101.544095], [3.052971, 101.544188], [3.052825, 101.544245], [3.052668, 101.544261], [3.052563, 101.544249], [3.052461, 101.544218], [3.052366, 101.544169], [3.052226, 101.544046], [3.052131, 101.543885], [3.05209, 101.543703], [3.052107, 101.543517], [3.052167, 101.543367], [3.052266, 101.543239], [3.052318, 101.543114], [3.052345, 101.542974], [3.052355, 101.542846], [3.052342, 101.542785], [3.052323, 101.542694], [3.052087, 101.542186], [3.051795, 101.541639], [3.051268, 101.540867], [3.051081, 101.540749], [3.050995, 101.540718], [3.050925, 101.540717], [3.050876, 101.540732], [3.050225, 101.54111], [3.050016, 101.54123], [3.049479, 101.54154], [3.049342, 101.5416], [3.04922, 101.541619], [3.049081, 101.541642], [3.048796, 101.541634]]
    },
    {
        id: "zone-south",
        name: "South Zone",
        color: "#d97706",
        centroid: [3.0230, 101.5345],
        ppsId: "pps4", // → SK Seksyen 16 (safe exit via Jalan Tegap & LKSA Highway)
        route: [[3.022941, 101.5345], [3.022942, 101.534814], [3.022311, 101.535001], [3.02231, 101.535169], [3.022604, 101.535071], [3.022829, 101.534999], [3.023056, 101.534926], [3.023963, 101.534633], [3.024393, 101.534446], [3.024652, 101.534936], [3.024695, 101.535017], [3.024715, 101.535055], [3.024907, 101.535419], [3.024997, 101.53559], [3.025023, 101.535639], [3.025301, 101.536164], [3.025475, 101.536494], [3.02598, 101.53623], [3.026603, 101.535987], [3.02843, 101.535346], [3.028562, 101.535272], [3.028737, 101.535083], [3.028774, 101.535012], [3.028827, 101.534953], [3.028912, 101.534899], [3.02901, 101.534874], [3.02911, 101.53488], [3.029204, 101.534917], [3.02925, 101.53495], [3.029289, 101.534991], [3.029426, 101.535028], [3.029522, 101.535036], [3.029639, 101.535023], [3.029996, 101.534949], [3.032026, 101.534526], [3.032097, 101.534498], [3.032198, 101.534409], [3.032282, 101.534311], [3.03231, 101.534269], [3.032352, 101.534191], [3.032399, 101.53408], [3.032421, 101.533937], [3.032162, 101.532608], [3.032062, 101.532], [3.031995, 101.531766], [3.031876, 101.531359], [3.0315, 101.530392], [3.031205, 101.529951], [3.030929, 101.529689], [3.031032, 101.529433], [3.031093, 101.529202], [3.031095, 101.528877], [3.031097, 101.528241], [3.031098, 101.528122], [3.031099, 101.527743], [3.031101, 101.527268], [3.031102, 101.526978], [3.031103, 101.526726], [3.031106, 101.526242], [3.030889, 101.526241], [3.03064, 101.52624], [3.030174, 101.526239], [3.029775, 101.526237], [3.029731, 101.526276], [3.029708, 101.526323], [3.029706, 101.526507], [3.029702, 101.526964], [3.02969, 101.528108], [3.029687, 101.528429], [3.029685, 101.528601], [3.029681, 101.529087], [3.029711, 101.529116], [3.029758, 101.529133], [3.030072, 101.529183], [3.030113, 101.529168], [3.030141, 101.529128], [3.030143, 101.528868], [3.030619, 101.528873], [3.031095, 101.528877], [3.031093, 101.529202], [3.031032, 101.529433], [3.030929, 101.529689], [3.031205, 101.529951], [3.0315, 101.530392], [3.031876, 101.531359], [3.031995, 101.531766], [3.032062, 101.532], [3.032162, 101.532608], [3.032421, 101.533937], [3.032458, 101.534027], [3.032536, 101.534124], [3.032636, 101.534193], [3.032725, 101.534258], [3.0328, 101.53431], [3.032967, 101.534343], [3.035283, 101.534227], [3.036979, 101.534121], [3.038333, 101.534074], [3.039675, 101.534058], [3.040804, 101.534018], [3.041617, 101.534017], [3.041698, 101.534014], [3.041873, 101.534009], [3.042356, 101.533998], [3.042671, 101.533992], [3.042754, 101.53399], [3.043569, 101.533942], [3.04397, 101.533861], [3.044021, 101.533842], [3.044066, 101.533801], [3.044128, 101.533712], [3.044169, 101.532828], [3.044206, 101.532038], [3.044218, 101.531799], [3.04422, 101.531738], [3.044328, 101.531745], [3.044677, 101.531766], [3.047936, 101.532036], [3.048078, 101.53201], [3.048157, 101.531974], [3.048228, 101.531911], [3.048274, 101.531822], [3.048361, 101.531592], [3.048376, 101.531279], [3.048391, 101.531103], [3.048447, 101.530719], [3.048516, 101.529973], [3.048519, 101.529401], [3.048472, 101.528886], [3.048418, 101.528561], [3.048372, 101.528284], [3.048325, 101.528064], [3.048259, 101.527804], [3.048192, 101.527662], [3.048092, 101.527453], [3.04776, 101.526898], [3.04748, 101.526521], [3.047204, 101.526319], [3.046888, 101.526173], [3.046755, 101.526144], [3.046632, 101.526086], [3.04651, 101.525984], [3.04642, 101.525853], [3.046367, 101.525703], [3.046357, 101.525545], [3.046389, 101.525389], [3.046443, 101.525275], [3.04652, 101.525175], [3.046643, 101.525077], [3.046788, 101.525016], [3.046944, 101.524994], [3.047059, 101.525006], [3.04717, 101.525039], [3.047219, 101.525045], [3.047689, 101.525167], [3.047881, 101.525188], [3.048014, 101.525195], [3.048156, 101.525191], [3.048673, 101.525033], [3.049977, 101.524639], [3.050474, 101.524497], [3.05079, 101.52446], [3.051741, 101.524168], [3.052062, 101.524069], [3.052371, 101.523974], [3.053443, 101.523654], [3.054308, 101.523385], [3.054931, 101.523184], [3.056428, 101.522726], [3.057727, 101.522314], [3.058429, 101.522092], [3.058654, 101.521959], [3.058737, 101.521882], [3.058768, 101.52181], [3.058788, 101.521733], [3.058594, 101.521103], [3.058303, 101.520156], [3.058258, 101.520006], [3.058228, 101.519905], [3.058167, 101.519699], [3.058118, 101.519532], [3.058029, 101.519276], [3.058025, 101.519254], [3.05799, 101.519143], [3.057953, 101.519016], [3.057836, 101.518971], [3.057689, 101.518914], [3.057606, 101.518883]]
    },
    {
        id: "zone-west",
        name: "West Zone",
        color: "#be185d",
        centroid: [3.0290, 101.5265],
        ppsId: "pps4", // → SK Seksyen 16 (west exit via LKSA highway)
        route: [[3.029706, 101.526507], [3.029708, 101.526323], [3.029731, 101.526276], [3.029775, 101.526237], [3.030174, 101.526239], [3.03064, 101.52624], [3.030889, 101.526241], [3.031106, 101.526242], [3.031103, 101.526726], [3.031102, 101.526978], [3.031101, 101.527268], [3.031099, 101.527743], [3.031098, 101.528122], [3.031097, 101.528241], [3.031095, 101.528877], [3.031093, 101.529202], [3.031032, 101.529433], [3.030929, 101.529689], [3.031205, 101.529951], [3.0315, 101.530392], [3.031876, 101.531359], [3.031995, 101.531766], [3.032062, 101.532], [3.032162, 101.532608], [3.032421, 101.533937], [3.032458, 101.534027], [3.032536, 101.534124], [3.032636, 101.534193], [3.032725, 101.534258], [3.0328, 101.53431], [3.032967, 101.534343], [3.035283, 101.534227], [3.036979, 101.534121], [3.038333, 101.534074], [3.039675, 101.534058], [3.040804, 101.534018], [3.041617, 101.534017], [3.041698, 101.534014], [3.041873, 101.534009], [3.042356, 101.533998], [3.042671, 101.533992], [3.042754, 101.53399], [3.043569, 101.533942], [3.04397, 101.533861], [3.044021, 101.533842], [3.044066, 101.533801], [3.044128, 101.533712], [3.044169, 101.532828], [3.044206, 101.532038], [3.044218, 101.531799], [3.04422, 101.531738], [3.044328, 101.531745], [3.044677, 101.531766], [3.047936, 101.532036], [3.048078, 101.53201], [3.048157, 101.531974], [3.048228, 101.531911], [3.048274, 101.531822], [3.048361, 101.531592], [3.048376, 101.531279], [3.048391, 101.531103], [3.048447, 101.530719], [3.048516, 101.529973], [3.048519, 101.529401], [3.048472, 101.528886], [3.048418, 101.528561], [3.048372, 101.528284], [3.048325, 101.528064], [3.048259, 101.527804], [3.048192, 101.527662], [3.048092, 101.527453], [3.04776, 101.526898], [3.04748, 101.526521], [3.047204, 101.526319], [3.046888, 101.526173], [3.046755, 101.526144], [3.046632, 101.526086], [3.04651, 101.525984], [3.04642, 101.525853], [3.046367, 101.525703], [3.046357, 101.525545], [3.046389, 101.525389], [3.046443, 101.525275], [3.04652, 101.525175], [3.046643, 101.525077], [3.046788, 101.525016], [3.046944, 101.524994], [3.047059, 101.525006], [3.04717, 101.525039], [3.047219, 101.525045], [3.047689, 101.525167], [3.047881, 101.525188], [3.048014, 101.525195], [3.048156, 101.525191], [3.048673, 101.525033], [3.049977, 101.524639], [3.050474, 101.524497], [3.05079, 101.52446], [3.051741, 101.524168], [3.052062, 101.524069], [3.052371, 101.523974], [3.053443, 101.523654], [3.054308, 101.523385], [3.054931, 101.523184], [3.056428, 101.522726], [3.057727, 101.522314], [3.058429, 101.522092], [3.058654, 101.521959], [3.058737, 101.521882], [3.058768, 101.52181], [3.058788, 101.521733], [3.058594, 101.521103], [3.058303, 101.520156], [3.058258, 101.520006], [3.058228, 101.519905], [3.058167, 101.519699], [3.058118, 101.519532], [3.058029, 101.519276], [3.058025, 101.519254], [3.05799, 101.519143], [3.057953, 101.519016], [3.057836, 101.518971], [3.057689, 101.518914], [3.057606, 101.518883]]
    }
];

// ---- Ray-Casting Point-in-Polygon ----
function pointInPolygon(lat, lng, polygon) {
    let inside = false;
    const n = polygon.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = polygon[i][1], yi = polygon[i][0];
        const xj = polygon[j][1], yj = polygon[j][0];
        const intersect = ((yi > lat) !== (yj > lat)) &&
            (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// ---- Grid config (A: 60×60 for smoothness) ----
const minLat = Math.min(...TSM_BOUNDARY.map(p => p[0]));
const maxLat = Math.max(...TSM_BOUNDARY.map(p => p[0]));
const minLng = Math.min(...TSM_BOUNDARY.map(p => p[1]));
const maxLng = Math.max(...TSM_BOUNDARY.map(p => p[1]));
const GRID_ROWS = 60, GRID_COLS = 60;
const latStep = (maxLat - minLat) / GRID_ROWS;
const lngStep = (maxLng - minLng) / GRID_COLS;

// ---- Multi-octave seeded noise (D: organic edges) ----
function seededRandom(seed) {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
}

function fbmNoise(r, c, octaves) {
    let val = 0, amp = 1, freq = 1, max = 0;
    for (let o = 0; o < octaves; o++) {
        val += seededRandom(r * freq * 137 + c * freq * 241 + o * 997) * amp;
        max += amp;
        amp *= 0.5;
        freq *= 2;
    }
    return val / max;
}

// ---- River proximity (B: radial gradient from river/low areas) ----
// Sungai Klang runs along the north-east; low-lying center is the flood epicenter
const FLOOD_EPICENTERS = [
    { lat: 3.0295, lng: 101.5370, weight: 1.0 },   // River-adjacent center
    { lat: 3.0260, lng: 101.5340, weight: 0.8 },   // Southern low area
    { lat: 3.0320, lng: 101.5400, weight: 0.7 },   // East near river bend
];

function getEpicenterInfluence(lat, lng) {
    let maxInfluence = 0;
    for (const ep of FLOOD_EPICENTERS) {
        const dist = Math.hypot(
            (lat - ep.lat) / (maxLat - minLat),
            (lng - ep.lng) / (maxLng - minLng)
        );
        const influence = ep.weight * Math.max(0, 1 - dist * 1.8);
        maxInfluence = Math.max(maxInfluence, influence);
    }
    return maxInfluence;
}

// Pre-build cells with organic vulnerability
const cells = [];
for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
        const cLat = minLat + (r + 0.5) * latStep;
        const cLng = minLng + (c + 0.5) * lngStep;
        if (!pointInPolygon(cLat, cLng, TSM_BOUNDARY)) continue;

        // (B) Radial gradient from epicenters
        const epicenterInfl = getEpicenterInfluence(cLat, cLng);

        // (D) Multi-octave noise for organic edges
        const noise = fbmNoise(r, c, 4);
        const edgeNoise = (noise - 0.5) * 0.5; // range: -0.25 to +0.25

        // Distance to polygon boundary for soft edge erosion
        let minBoundaryDist = Infinity;
        for (const bp of TSM_BOUNDARY) {
            const d = Math.hypot(cLat - bp[0], cLng - bp[1]);
            minBoundaryDist = Math.min(minBoundaryDist, d);
        }
        const edgeFade = Math.min(1, minBoundaryDist / 0.003); // soft fade near boundary

        const rawVuln = epicenterInfl * 0.7 + noise * 0.3;
        const vulnerability = Math.max(0, Math.min(1.0, rawVuln * edgeFade + edgeNoise * edgeFade));

        // (D) Skip cells at organic edges (erosion)
        if (vulnerability < 0.03) continue;

        cells.push({
            swLat: minLat + r * latStep, swLng: minLng + c * lngStep,
            neLat: minLat + (r + 1) * latStep, neLng: minLng + (c + 1) * lngStep,
            cLat, cLng,
            vulnerability
        });
    }
}

// ---- Map Init ----
const map = L.map('map', { zoomControl: true }).setView([3.0295, 101.5360], 14);

// Basemap Layers (Default: Google Maps Standard Green/Roadmap)
const googleStandard = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '&copy; Google Maps'
});

const googleTerrain = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '&copy; Google Maps'
});

const googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: '&copy; Google Maps'
});

const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
});

const esriDark = L.layerGroup([
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 1,
        maxNativeZoom: 16,
        maxZoom: 20,
        attribution: 'Tiles &copy; Esri'
    }),
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 1,
        maxNativeZoom: 16,
        maxZoom: 20
    })
]);

// Set Google Maps Standard as default
googleStandard.addTo(map);

// Add base map selector control
L.control.layers({
    "🗺️ Google Maps (Standard)": googleStandard,
    "⛰️ Google Terrain": googleTerrain,
    "🛰️ Google Satellite": googleSatellite,
    "🌍 OpenStreetMap": osmStandard,
    "🌙 Dark Mode": esriDark
}, null, { position: 'topright' }).addTo(map);

// (E) Create custom pane for shimmer effect
map.createPane('floodPane');
map.getPane('floodPane').style.zIndex = 350;
map.createPane('contourPane');
map.getPane('contourPane').style.zIndex = 355;

// TSM boundary outline
L.polygon(TSM_BOUNDARY, {
    color: '#818cf8', weight: 2.5, opacity: 0.8,
    fill: false, dashArray: '8, 5'
}).addTo(map).bindTooltip('Taman Sri Muda', {
    permanent: true, direction: 'center', className: 'area-label'
});

// ---- PPS Markers ----
const ppsIconPrimary = L.divIcon({
    className: '',
    html: `<div class="pps-marker primary"><span>🏥</span></div>`,
    iconSize: [38, 38], iconAnchor: [19, 19]
});
const ppsIconSecondary = L.divIcon({
    className: '',
    html: `<div class="pps-marker secondary"><span>🏫</span></div>`,
    iconSize: [34, 34], iconAnchor: [17, 17]
});

const ppsMap = {};
PPS_LOCATIONS.forEach(pps => {
    const icon = pps.type === 'primary' ? ppsIconPrimary : ppsIconSecondary;
    const paxPct = Math.min(100, Math.round((pps.current_pax / pps.capacity) * 100));
    const paxColor = paxPct > 90 ? '#ef4444' : paxPct > 70 ? '#f59e0b' : '#10b981';
    const marker = L.marker(pps.coords, { icon })
        .addTo(map)
        .bindPopup(`
            <div class="pps-popup">
                <div class="pps-popup-title">${pps.name}</div>
                <div class="pps-popup-tag ${pps.type}">${pps.type === 'primary' ? '🔴 Primary Centre' : '🟡 Secondary Centre'}</div>
                <div class="pps-popup-row" style="margin-top:8px;">👥 Capacity: <b>${pps.capacity.toLocaleString()}</b></div>
                <div class="pps-popup-row">
                    🏕️ Occupancy: <b style="color:${paxColor}">${pps.current_pax}</b> (${paxPct}%)
                    <div class="pax-bar-container">
                        <div class="pax-bar-fill" style="width: ${paxPct}%; background: ${paxColor}"></div>
                    </div>
                </div>
                <div class="pps-popup-note">${pps.note}</div>
            </div>
        `, { maxWidth: 260 });
    ppsMap[pps.id] = marker;
});

// ---- Zone Focus State & Controller ----
let activeFocusedZoneId = null;

function focusZone(zoneId) {
    activeFocusedZoneId = (activeFocusedZoneId === zoneId) ? null : zoneId;

    // Update pill buttons
    document.querySelectorAll('.zone-pill').forEach(pill => {
        if (!activeFocusedZoneId && pill.dataset.zone === 'all') {
            pill.classList.add('active');
        } else if (pill.dataset.zone === activeFocusedZoneId) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });

    // Update route banner
    const banner = document.getElementById('route-focus-banner');
    const bannerText = document.getElementById('route-focus-text');
    if (activeFocusedZoneId) {
        const zone = EVAC_ZONES.find(z => z.id === activeFocusedZoneId);
        const pps = PPS_LOCATIONS.find(p => p.id === zone.ppsId);
        if (banner && bannerText && zone && pps) {
            bannerText.innerHTML = `📍 <b>${zone.name} Corridor:</b> Follow glowing path to <b>${pps.name}</b> <span style="color:#34d399;font-weight:600;margin-left:4px;">(Safe High Ground)</span>`;
            banner.style.borderLeftColor = zone.color;
            banner.style.display = 'flex';
        }
        if (zone) {
            map.flyTo(zone.centroid, 14, { duration: 0.6 });
        }
    } else {
        if (banner) banner.style.display = 'none';
        map.flyTo([3.0295, 101.5360], 14, { duration: 0.6 });
    }

    // Refresh routes with new focus state
    const currentRain = Number(slider ? slider.value : 0);
    drawEvacuationRoutes(currentRain);
}
window.focusZone = focusZone;

// Bind Zone Filter Bar
function initZoneFilter() {
    const bar = document.getElementById('zone-filter-bar');
    if (bar) {
        bar.addEventListener('click', (e) => {
            const pill = e.target.closest('.zone-pill');
            if (!pill) return;
            const target = pill.dataset.zone === 'all' ? null : pill.dataset.zone;
            focusZone(target);
        });
    }
    const resetBtn = document.getElementById('route-focus-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => focusZone(null));
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initZoneFilter);
} else {
    initZoneFilter();
}

// ---- Zone Labels (Interactive) ----
EVAC_ZONES.forEach(zone => {
    const zoneIcon = L.divIcon({
        className: '',
        html: `<div class="zone-label" style="border-color:${zone.color};color:${zone.color};cursor:pointer;" title="Click to isolate ${zone.name} route">${zone.name}</div>`,
        iconSize: [84, 24], iconAnchor: [42, 12]
    });
    const zm = L.marker(zone.centroid, { icon: zoneIcon, interactive: true }).addTo(map);
    zm.on('click', () => focusZone(zone.id));
});

// ---- Evacuation Route Layers (Redesigned & De-cluttered) ----
let routeLayers = [];
let routeAnimFrame = null;

// Create route pane above flood
map.createPane('routeGlowPane');
map.getPane('routeGlowPane').style.zIndex = 400;
map.createPane('routeLinePane');
map.getPane('routeLinePane').style.zIndex = 405;
map.createPane('routeArrowPane');
map.getPane('routeArrowPane').style.zIndex = 410;

// Compute bearing angle between two latlng points (in degrees)
function bearing(from, to) {
    const dLng = to[1] - from[1];
    const dLat = to[0] - from[0];
    return Math.atan2(dLng, dLat) * (180 / Math.PI);
}

// Create a small, elegant SVG chevron direction marker
function createArrowMarker(position, angle, color, size = 12) {
    const icon = L.divIcon({
        className: '',
        html: `<div class="route-arrow" style="transform:rotate(${angle - 90}deg)">
            <svg width="${size}" height="${size}" viewBox="0 0 24 24">
                <polygon points="6,4 18,12 6,20" fill="${color}" opacity="0.95"/>
            </svg>
        </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
    return L.marker(position, { icon, interactive: false, pane: 'routeArrowPane' });
}

function drawEvacuationRoutes(rainfall) {
    // Clean up
    routeLayers.forEach(l => map.removeLayer(l));
    routeLayers = [];
    if (routeAnimFrame) { cancelAnimationFrame(routeAnimFrame); routeAnimFrame = null; }
    if (rainfall < 50) return;

    const urgency = rainfall >= 150 ? 'high' : rainfall >= 100 ? 'moderate' : 'low';

    EVAC_ZONES.forEach(zone => {
        const pps = PPS_LOCATIONS.find(p => p.id === zone.ppsId);
        const isExplicitSelected = (activeFocusedZoneId === zone.id);
        const isFocused = (activeFocusedZoneId === null || isExplicitSelected);

        // Opacity and weight tuning: if a zone is focused, dim all other routes
        const lineOpacity = isExplicitSelected ? 1.0 : (activeFocusedZoneId === null ? 0.85 : 0.10);
        const lineWeight = isExplicitSelected ? 4.5 : (activeFocusedZoneId === null ? 3.0 : 1.5);
        const glowOpacity = isExplicitSelected ? 0.30 : (activeFocusedZoneId === null ? 0.12 : 0);
        const glowWeight = isExplicitSelected ? 10 : 5;

        // Layer 1: Glow trail
        if (glowOpacity > 0) {
            const glowLine = L.polyline(zone.route, {
                color: zone.color,
                weight: glowWeight,
                opacity: glowOpacity,
                lineCap: 'round',
                lineJoin: 'round',
                pane: 'routeGlowPane',
                interactive: false
            }).addTo(map);
            routeLayers.push(glowLine);
        }

        // Layer 2: Main route line with flowing dash
        const routeLine = L.polyline(zone.route, {
            color: zone.color,
            weight: lineWeight,
            opacity: lineOpacity,
            dashArray: '10, 8',
            lineCap: 'round',
            lineJoin: 'round',
            pane: 'routeLinePane',
            className: `evac-route ${isExplicitSelected ? 'evac-route-flow' : ''}`
        }).addTo(map);

        routeLine.on('click', () => focusZone(zone.id));
        routeLayers.push(routeLine);

        // Layer 3: ONLY place 2-3 sleek direction chevrons (proportional, NOT on every point!)
        if (isFocused && zone.route.length > 6) {
            const numArrows = isExplicitSelected ? 4 : 2;
            for (let a = 1; a <= numArrows; a++) {
                const idx = Math.min(zone.route.length - 2, Math.floor((a / (numArrows + 1)) * zone.route.length));
                const from = zone.route[idx];
                const to = zone.route[idx + 1];
                const angle = bearing(from, to);
                const arrow = createArrowMarker(from, angle, zone.color, isExplicitSelected ? 13 : 10);
                arrow.addTo(map);
                routeLayers.push(arrow);
            }
        }

        // Origin beacon
        if (isFocused) {
            const originIcon = L.divIcon({
                className: '',
                html: `<div class="route-origin-marker ${urgency}" style="cursor:pointer;" title="Click to isolate ${zone.name}">
                    <div class="route-origin-ring" style="border-color:${zone.color}"></div>
                    <div class="route-origin-core" style="background:${zone.color}"></div>
                </div>`,
                iconSize: [20, 20], iconAnchor: [10, 10]
            });
            const originMarker = L.marker(zone.centroid, { icon: originIcon, interactive: true }).addTo(map);
            originMarker.on('click', () => focusZone(zone.id));
            routeLayers.push(originMarker);
        }

        // Destination highlight ring on PPS
        if (isExplicitSelected) {
            const destIcon = L.divIcon({
                className: '',
                html: `<div class="route-dest-ring" style="border-color:${zone.color}"></div>`,
                iconSize: [36, 36], iconAnchor: [18, 18]
            });
            const destMarker = L.marker(zone.route[zone.route.length - 1], { icon: destIcon, interactive: false }).addTo(map);
            routeLayers.push(destMarker);
        }

        // Popup on route click
        routeLine.bindPopup(`
            <div class="route-popup">
                <div class="route-popup-title" style="color:${zone.color}">🚨 Evacuation Corridor — ${zone.name}</div>
                <div class="route-popup-dest">→ Designated PPS: <b>${pps.name}</b></div>
                <div class="route-popup-cap">Capacity: ${pps.capacity.toLocaleString()} evacuees</div>
                <div class="route-popup-urgent ${urgency}">
                    ${urgency === 'high' ? '⚠️ EVACUATE NOW! High Flood Danger!' :
                      urgency === 'moderate' ? '⚡ Prepare for evacuation' :
                      '📢 Monitor situation, stay alert'}
                </div>
            </div>
        `, { maxWidth: 240 });
    });
}

// ---- Flood Visualization (Realistic Hydrological Water Depth Scale) ----
let gridLayer = null;
let contourLayer = null;
let shimmerActive = false;

function getFloodColor(rainfall, vulnerability) {
    const intensity = Math.min(1.0, (rainfall / 200) * 1.5 * vulnerability);
    if (rainfall === 0 || intensity < 0.04) return null;

    // Translucent depth scale: ensures roads, street names, and satellite view stay readable
    let fill, opacity;
    if (intensity < 0.20) {
        // Shallow runoff (< 0.3m): Gentle sky blue
        fill = '#38bdf8';
        opacity = 0.16 + intensity * 0.4;
    } else if (intensity < 0.45) {
        // Low / water accumulation (0.3m - 0.7m): Royal blue
        const t = (intensity - 0.20) / 0.25;
        fill = '#2563eb';
        opacity = 0.22 + t * 0.06;
    } else if (intensity < 0.72) {
        // Moderate / road impassable for cars (0.7m - 1.2m): Amber
        const t = (intensity - 0.45) / 0.27;
        fill = '#f59e0b';
        opacity = 0.28 + t * 0.06;
    } else if (intensity < 0.88) {
        // Severe inundation (1.2m - 1.8m): Vivid orange-red
        const t = (intensity - 0.72) / 0.16;
        fill = '#ea580c';
        opacity = 0.33 + t * 0.05;
    } else {
        // Danger / critical chest-deep (> 1.8m): Translucent Crimson Red
        const t = Math.min(1, (intensity - 0.88) / 0.12);
        fill = '#dc2626';
        opacity = 0.38 + t * 0.05; // Maximum 0.43 opacity!
    }

    return { fill, opacity };
}

// (F) Contour iso-lines at depth thresholds
function buildContourRings(rainfall) {
    if (contourLayer) { map.removeLayer(contourLayer); contourLayer = null; }
    if (rainfall < 30) return;

    const thresholds = [0.25, 0.50, 0.75];
    const contourColors = ['rgba(56,189,248,0.25)', 'rgba(129,140,248,0.35)', 'rgba(236,72,153,0.45)'];
    const contourWeights = [1, 1.2, 1.5];
    const contours = [];

    thresholds.forEach((thresh, ti) => {
        const intensity = thresh;
        // Find cells near the threshold boundary
        cells.forEach(cell => {
            const cellIntensity = Math.min(1.0, (rainfall / 200) * 1.5 * cell.vulnerability);
            const diff = Math.abs(cellIntensity - intensity);
            if (diff < 0.06) {
                // Draw a small ring segment at this cell
                const ring = L.rectangle(
                    [[cell.swLat, cell.swLng], [cell.neLat, cell.neLng]],
                    {
                        color: contourColors[ti],
                        weight: contourWeights[ti],
                        opacity: 0.6,
                        fill: false,
                        dashArray: '3, 4',
                        interactive: false,
                        pane: 'contourPane'
                    }
                );
                contours.push(ring);
            }
        });
    });

    if (contours.length > 0) {
        contourLayer = L.layerGroup(contours).addTo(map);
    }
}

// (E) Shimmer animation via CSS on the flood pane
function toggleShimmer(active) {
    const pane = map.getPane('floodPane');
    if (!pane) return;
    if (active && !shimmerActive) {
        pane.classList.add('flood-shimmer');
        shimmerActive = true;
    } else if (!active && shimmerActive) {
        pane.classList.remove('flood-shimmer');
        shimmerActive = false;
    }
}

function drawFloodGrid(rainfall) {
    if (gridLayer) { map.removeLayer(gridLayer); gridLayer = null; }
    toggleShimmer(false);
    if (rainfall == 0) { buildContourRings(0); return; }

    const layers = cells.map(cell => {
        const style = getFloodColor(rainfall, cell.vulnerability);
        if (!style) return null;
        return L.rectangle(
            [[cell.swLat, cell.swLng], [cell.neLat, cell.neLng]],
            {
                // (A) No visible borders — weight 0
                color: 'transparent', weight: 0,
                fillColor: style.fill, fillOpacity: style.opacity,
                interactive: false,
                pane: 'floodPane'
            }
        );
    }).filter(Boolean);

    gridLayer = L.layerGroup(layers).addTo(map);

    // (E) Activate shimmer
    toggleShimmer(true);

    // (F) Draw contour iso-lines
    buildContourRings(rainfall);
}

// ---- Legend ----
const legend = L.control({ position: 'bottomleft' });
legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'map-legend');
    div.id = 'desktop-map-legend';
    div.innerHTML = `
        <div class="legend-header" onclick="window.toggleDesktopLegend()" title="Click to collapse / expand">
            <div class="legend-title" style="margin-bottom:0;">🌊 Map Legend</div>
            <span class="legend-toggle-btn" id="legend-toggle-icon">▼</span>
        </div>
        <div class="legend-content-body" id="legend-content-body">
            <div class="legend-subtitle">💧 Water Depth (Est.)</div>
            <div class="legend-item"><span style="background:#38bdf8"></span> &lt; 0.3m (Ankle / Shallow)</div>
            <div class="legend-item"><span style="background:#2563eb"></span> 0.3m – 0.7m (Knee / Car Alert)</div>
            <div class="legend-item"><span style="background:#f59e0b"></span> 0.7m – 1.2m (Waist / Impassable)</div>
            <div class="legend-item"><span style="background:#ea580c"></span> 1.2m – 1.8m (Chest / Danger)</div>
            <div class="legend-item"><span style="background:#dc2626"></span> &gt; 1.8m (Critical / Submerged)</div>
            <div class="legend-divider"></div>
            <div class="legend-subtitle">🚨 Safe Evacuation Corridors</div>
            <div class="legend-item legend-clickable" onclick="window.focusZone && window.focusZone('zone-north')"><span style="background:#7c3aed"></span> North → Dewan MBSA Sek28</div>
            <div class="legend-item legend-clickable" onclick="window.focusZone && window.focusZone('zone-east')"><span style="background:#0891b2"></span> East → Dewan MBSA (Aman Perimeter)</div>
            <div class="legend-item legend-clickable" onclick="window.focusZone && window.focusZone('zone-center')"><span style="background:#059669"></span> Central → Dewan MBSA (North Spine)</div>
            <div class="legend-item legend-clickable" onclick="window.focusZone && window.focusZone('zone-south')"><span style="background:#d97706"></span> South → SK Sek16 (LKSA Highway)</div>
            <div class="legend-item legend-clickable" onclick="window.focusZone && window.focusZone('zone-west')"><span style="background:#be185d"></span> West → SK Sek16 (LKSA Highway)</div>
            <div class="legend-note">💡 Click corridor to isolate safe route</div>
        </div>
    `;
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    return div;
};
legend.addTo(map);

window.toggleDesktopLegend = function () {
    const body = document.getElementById('legend-content-body');
    const icon = document.getElementById('legend-toggle-icon');
    if (!body || !icon) return;
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    icon.textContent = isHidden ? '▼' : '▲';
};

// ---- Move Weather Widget to Map Control ----
const weatherControl = L.control({ position: 'bottomright' });
weatherControl.onAdd = function () {
    const widget = document.getElementById('weather-widget');
    widget.classList.add('leaflet-control');
    // Ensure it matches legend width (approx 245px) and spacing
    widget.style.position = 'relative';
    widget.style.top = 'auto';
    widget.style.right = 'auto';
    widget.style.width = '245px'; 
    widget.style.minWidth = '245px';
    widget.style.marginBottom = '10px'; // Gap between widget and legend
    return widget;
};
weatherControl.addTo(map);

// ---- Slider & API ----
const slider        = document.getElementById('rainfall-slider');
const sliderValue   = document.getElementById('rainfall-value');
const rainfallBar   = document.getElementById('rainfall-bar');
const riskLevelSpan = document.getElementById('risk-level');
const riskCard      = document.getElementById('risk-indicator');
const riskIcon      = document.getElementById('risk-icon');
const evacBadge     = document.getElementById('evac-badge');
const checklist     = document.getElementById('checklist');
const API_URL       = 'http://localhost:8000';

const RISK_ICONS = { safe: '🛡️', low: '🌧️', moderate: '⚡', high: '🚨' };

slider.addEventListener('input', function () {
    const val = Number(this.value);
    sliderValue.textContent = val;
    rainfallBar.style.width = (val / 200 * 100) + '%';
    simulateFlood(val);
});

// ---- Live Weather Mode ----
const weatherWidget = document.getElementById('weather-widget');
const wTemp = document.getElementById('weather-temp');
const wCond = document.getElementById('weather-cond');
const wRain = document.getElementById('weather-rain');
const wUpdate = document.getElementById('weather-update');

let liveInterval = null;

document.body.addEventListener('change', function(e) {
    if (e.target.id === 'mode-toggle' || e.target.id === 'mode-toggle-m') {
        const isChecked = e.target.checked;
        
        // Sync both toggles if they exist
        const mainToggle = document.getElementById('mode-toggle');
        const clonedToggle = document.getElementById('mode-toggle-m');
        if (mainToggle) mainToggle.checked = isChecked;
        if (clonedToggle) clonedToggle.checked = isChecked;

        // Update labels for all wrappers
        document.querySelectorAll('.mode-toggle-wrap').forEach(wrap => {
            const sim = wrap.querySelector('#label-sim') || wrap.querySelector('#label-sim-m');
            const liv = wrap.querySelector('#label-live') || wrap.querySelector('#label-live-m');
            if (isChecked) {
                if (sim) sim.classList.remove('active');
                if (liv) liv.classList.add('active');
            } else {
                if (liv) liv.classList.remove('active');
                if (sim) sim.classList.add('active');
            }
        });

        const clonedSlider = document.getElementById('rainfall-slider-m');
        if (isChecked) {
            // Live Mode
            slider.disabled = true; slider.style.opacity = '0.5';
            if (clonedSlider) { clonedSlider.disabled = true; clonedSlider.style.opacity = '0.5'; }
            if (weatherWidget) weatherWidget.style.display = 'block';
            fetchLiveWeather();
            liveInterval = setInterval(fetchLiveWeather, 60000);
        } else {
            // Sim Mode
            slider.disabled = false; slider.style.opacity = '1';
            if (clonedSlider) { clonedSlider.disabled = false; clonedSlider.style.opacity = '1'; }
            if (weatherWidget) weatherWidget.style.display = 'none';
            if (liveInterval) clearInterval(liveInterval);
            simulateFlood(slider.value);
        }
    }
});

async function fetchLiveWeather() {
    try {
        const res = await fetch(`${API_URL}/weather/live`);
        const data = await res.json();
        
        // Update widget
        if (wTemp) wTemp.textContent = `${data.temperature_c}°C`;
        if (wCond) wCond.textContent = data.condition;
        if (wRain) wRain.innerHTML = `${data.rainfall_1h_mm} mm/h`;
        if (wUpdate) wUpdate.textContent = `Updated: ${data.timestamp}`;
        
        // Emulate rain level on UI
        const mm = data.rainfall_1h_mm;
        sliderValue.textContent = mm;
        rainfallBar.style.width = Math.min((mm / 200 * 100), 100) + '%';
        slider.value = mm;
        
        // Trigger simulation
        simulateFlood(mm);
    } catch (e) {
        console.error("Live weather failed", e);
        if (wCond) wCond.textContent = "API Offline";
    }
}

async function simulateFlood(rainfall) {
    try {
        const res = await fetch(`${API_URL}/simulate?rainfall=${rainfall}`);
        const data = await res.json();
        updateRiskIndicator(data.risk_level);
        updateChecklist(data.risk_level);
    } catch (_) {
        // Fallback: determine risk locally if API is unavailable
        let level = 'Safe';
        if (rainfall >= 150) level = 'High';
        else if (rainfall >= 100) level = 'Moderate';
        else if (rainfall >= 50) level = 'Low';
        updateRiskIndicator(level);
        updateChecklist(level);
    }
    drawFloodGrid(Number(rainfall));
    drawEvacuationRoutes(Number(rainfall));

    const existingBanner = document.getElementById('warning-banner');
    if (rainfall >= 150) {
        if (!existingBanner) {
            const banner = document.createElement('div');
            banner.id = 'warning-banner';
            banner.className = 'critical-warning-banner';
            banner.innerHTML = '⚠️ <strong>CRITICAL WARNING:</strong> Evacuate low-lying zones immediately. Follow the glowing routes to your designated PPS.';
            document.body.appendChild(banner);
        }
    } else if (existingBanner) {
        existingBanner.remove();
    }

    // Toggle evacuation badge
    if (evacBadge) evacBadge.style.display = rainfall >= 50 ? '' : 'none';
}

function updateRiskIndicator(level) {
    const key = level.toLowerCase();
    riskLevelSpan.textContent = level;
    riskLevelSpan.className = 'risk-value';
    riskCard.setAttribute('data-risk', key);
    riskIcon.textContent = RISK_ICONS[key] || '🛡️';
}

function updateChecklist(level) {
    const items = {
        Safe:     ['Monitor weather updates.', 'Keep emergency kits ready.'],
        Low:      ['Clear drains around your house.', 'Move valuables to higher ground.', 'Stay alert for sirens.'],
        Moderate: ['Park vehicles on high ground.', 'Prepare to evacuate if instructed.', 'Keep phones fully charged.'],
        High:     ['EVACUATE IMMEDIATELY to nearest centre!', 'Turn off main electrical switches.', 'Follow authorities\' instructions.']
    };
    checklist.innerHTML = (items[level] || items.Safe).map(i => `<li>${i}</li>`).join('');
}

simulateFlood(0);

// =============================================
// Mobile Drawer (Bottom Sheet) Logic
// =============================================
(function () {
    const fab        = document.getElementById('mobile-fab');
    const drawer     = document.getElementById('mobile-drawer');
    const overlay    = document.getElementById('mobile-overlay');
    const closeBtn   = document.getElementById('drawer-close-btn');
    const drawerBody = document.getElementById('drawer-content');

    if (!fab || !drawer || !overlay || !drawerBody) return;

    // --- Populate drawer with sidebar content ---
    // We clone the desktop sidebar panels into the drawer so they share IDs
    // and remain live (same DOM nodes, just moved).
    function populateDrawer() {
        if (drawerBody.children.length > 0) return; // already populated
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        // Move children into the drawer
        Array.from(sidebar.children).forEach(child => {
            drawerBody.appendChild(child.cloneNode(true));
        });

        // Re-wire the cloned slider to drive the originals
        const clonedSlider = drawerBody.querySelector('#rainfall-slider');
        if (clonedSlider) {
            // Give cloned elements unique IDs to avoid conflicts
            clonedSlider.id = 'rainfall-slider-m';
            const clonedValue  = drawerBody.querySelector('#rainfall-value');
            const clonedBar    = drawerBody.querySelector('#rainfall-bar');
            const clonedRisk   = drawerBody.querySelector('#risk-indicator');
            const clonedLevel  = drawerBody.querySelector('#risk-level');
            const clonedIcon   = drawerBody.querySelector('#risk-icon');
            const clonedList   = drawerBody.querySelector('#checklist');
            if (clonedValue)  clonedValue.id  = 'rainfall-value-m';
            if (clonedBar)    clonedBar.id    = 'rainfall-bar-m';
            if (clonedRisk)   clonedRisk.id   = 'risk-indicator-m';
            if (clonedLevel)  clonedLevel.id  = 'risk-level-m';
            if (clonedIcon)   clonedIcon.id   = 'risk-icon-m';
            if (clonedList)   clonedList.id   = 'checklist-m';
            
            // Rename toggle IDs so delegation finds them
            const clonedToggle = drawerBody.querySelector('#mode-toggle');
            if (clonedToggle) {
                clonedToggle.id = 'mode-toggle-m';
                const wrap = clonedToggle.closest('.mode-toggle-wrap');
                if (wrap) {
                    const lSim = wrap.querySelector('#label-sim');
                    const lLive = wrap.querySelector('#label-live');
                    if (lSim) lSim.id = 'label-sim-m';
                    if (lLive) lLive.id = 'label-live-m';
                }
                const mainToggle = document.getElementById('mode-toggle');
                if (mainToggle) clonedToggle.checked = mainToggle.checked;
            }

            // Sync cloned slider value with main slider value on open
            clonedSlider.value = slider.value;
            if (clonedValue) clonedValue.textContent = slider.value;
            if (clonedBar)   clonedBar.style.width = (Number(slider.value) / 200 * 100) + '%';

            // Mirror risk state
            const mainRisk = document.getElementById('risk-indicator');
            if (clonedRisk && mainRisk) {
                clonedRisk.setAttribute('data-risk', mainRisk.getAttribute('data-risk') || 'safe');
            }
            if (clonedLevel) clonedLevel.textContent = riskLevelSpan.textContent;
            if (clonedIcon)  clonedIcon.textContent  = riskIcon.textContent;
            if (clonedList)  clonedList.innerHTML     = checklist.innerHTML;

            clonedSlider.addEventListener('input', function () {
                const val = Number(this.value);
                // Update cloned display
                if (clonedValue) clonedValue.textContent = val;
                if (clonedBar)   clonedBar.style.width   = (val / 200 * 100) + '%';
                // Also update the main (hidden) slider so state is consistent
                slider.value = val;
                rainfallBar.style.width = (val / 200 * 100) + '%';
                sliderValue.textContent = val;
                simulateFlood(val);
                // Keep cloned risk in sync (simulateFlood updates originals)
                setTimeout(() => {
                    const mainRisk = document.getElementById('risk-indicator');
                    if (clonedRisk && mainRisk) {
                        clonedRisk.setAttribute('data-risk', mainRisk.getAttribute('data-risk') || 'safe');
                    }
                    if (clonedLevel) clonedLevel.textContent = riskLevelSpan.textContent;
                    if (clonedIcon)  clonedIcon.textContent  = riskIcon.textContent;
                    if (clonedList)  clonedList.innerHTML     = checklist.innerHTML;
                    updateFabLabel(riskLevelSpan.textContent);
                }, 120);
            });
        }
    }

    function updateFabLabel(risk) {
        const label = fab.querySelector('span') || fab;
        // Update aria-label only — visual label stays concise
        fab.setAttribute('aria-label', `Open controls — Risk: ${risk}`);
    }

    // --- Open / Close ---
    function openDrawer() {
        populateDrawer();
        overlay.classList.add('active');
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        fab.style.opacity = '0';
        fab.style.pointerEvents = 'none';
        const sosBtn = document.getElementById('btn-sos');
        if (sosBtn) {
            sosBtn.style.opacity = '0';
            sosBtn.style.pointerEvents = 'none';
        }
    }

    function closeDrawer() {
        overlay.classList.remove('active');
        drawer.classList.remove('active');
        document.body.style.overflow = '';
        fab.style.opacity = '1';
        fab.style.pointerEvents = '';
        const sosBtn = document.getElementById('btn-sos');
        if (sosBtn) {
            sosBtn.style.opacity = '';
            sosBtn.style.pointerEvents = '';
        }
    }

    fab.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // --- Swipe-down to dismiss ---
    let touchStartY = 0;
    let drawerStartTranslate = 0;

    drawer.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        drawerStartTranslate = 0;
        drawer.style.transition = 'none';
    }, { passive: true });

    drawer.addEventListener('touchmove', (e) => {
        const dy = e.touches[0].clientY - touchStartY;
        if (dy > 0) {
            drawer.style.transform = `translateY(${dy}px)`;
        }
    }, { passive: true });

    drawer.addEventListener('touchend', (e) => {
        drawer.style.transition = '';
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (dy > 100) {
            closeDrawer();
            drawer.style.transform = '';
        } else {
            drawer.style.transform = '';
        }
    });

    // --- Keyboard dismiss ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('active')) closeDrawer();
    });
})();

// =============================================
// Mobile Legend Toggle
// =============================================
(function () {
    const btn  = document.getElementById('mobile-legend-btn');
    const wrap = document.getElementById('mobile-legend-wrap');
    if (!btn || !wrap) return;

    const LEGEND_HTML = `
        <div class="mobile-legend-popup" id="mobile-legend-popup">
            <div class="legend-title">🌊 Water Depth (Est.)</div>
            <div class="legend-item"><span style="background:#38bdf8"></span> &lt; 0.3m (Ankle)</div>
            <div class="legend-item"><span style="background:#2563eb"></span> 0.3m – 0.7m (Knee)</div>
            <div class="legend-item"><span style="background:#f59e0b"></span> 0.7m – 1.2m (Waist)</div>
            <div class="legend-item"><span style="background:#ea580c"></span> 1.2m – 1.8m (Chest)</div>
            <div class="legend-item"><span style="background:#dc2626"></span> &gt; 1.8m (Critical)</div>
            <div class="legend-divider"></div>
            <div class="legend-title">🚨 Safe Evacuation Corridors</div>
            <div class="legend-item legend-clickable" onclick="window.focusZone && window.focusZone('zone-north')"><span style="background:#7c3aed"></span> North → Dewan MBSA Sek28</div>
            <div class="legend-item legend-clickable" onclick="window.focusZone && window.focusZone('zone-east')"><span style="background:#0891b2"></span> East → Dewan MBSA (Aman Perimeter)</div>
            <div class="legend-item legend-clickable" onclick="window.focusZone && window.focusZone('zone-center')"><span style="background:#059669"></span> Central → Dewan MBSA (North Spine)</div>
            <div class="legend-item legend-clickable" onclick="window.focusZone && window.focusZone('zone-south')"><span style="background:#d97706"></span> South → SK Sek16 (LKSA Highway)</div>
            <div class="legend-item legend-clickable" onclick="window.focusZone && window.focusZone('zone-west')"><span style="background:#be185d"></span> West → SK Sek16 (LKSA Highway)</div>
            <div class="legend-note">💡 Tap corridor to isolate safe route</div>
        </div>`;

    let open = false;
    let popup = null;

    function openLegend() {
        if (open) return;
        open = true;
        btn.setAttribute('aria-expanded', 'true');
        wrap.insertAdjacentHTML('beforeend', LEGEND_HTML);
        popup = document.getElementById('mobile-legend-popup');
        // Close on outside tap
        setTimeout(() => {
            document.addEventListener('touchstart', outsideTap, { passive: true });
            document.addEventListener('click', outsideTap);
        }, 50);
    }

    function closeLegend() {
        if (!open) return;
        open = false;
        btn.setAttribute('aria-expanded', 'false');
        if (popup) { popup.remove(); popup = null; }
        document.removeEventListener('touchstart', outsideTap);
        document.removeEventListener('click', outsideTap);
    }

    function outsideTap(e) {
        if (!wrap.contains(e.target)) closeLegend();
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        open ? closeLegend() : openLegend();
    });
})();

// =============================================
// SOS Feature (First Responder)
// =============================================
(function () {
    const btnSos = document.getElementById('btn-sos');
    const modalSos = document.getElementById('modal-sos');
    const btnCancel = document.getElementById('btn-cancel-sos');
    const formSos = document.getElementById('form-sos');

    if (!btnSos || !modalSos) return;

    btnSos.addEventListener('click', () => {
        modalSos.style.display = 'flex';
    });

    btnCancel.addEventListener('click', () => {
        modalSos.style.display = 'none';
    });

    modalSos.addEventListener('click', (e) => {
        if (e.target === modalSos) modalSos.style.display = 'none';
    });

    formSos.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('sos_name').value.trim();
        const phoneRaw = document.getElementById('sos_phone').value;
        const phone = phoneRaw.replace(/[-\s]/g, '');
        
        // Simulate grabbing GPS coords (Taman Sri Muda area)
        const lat = 3.0300 + (Math.random() * 0.005 - 0.0025);
        const lng = 101.5300 + (Math.random() * 0.005 - 0.0025);

        try {
            const res = await fetch(`${API_URL}/sos`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, phone, lat, lng })
            });
            if(res.ok) {
                modalSos.style.display = 'none';
                formSos.reset();
                const successModal = document.getElementById('modal-sos-success');
                if (successModal) successModal.style.display = 'flex';
            } else {
                alert("Failed to send SOS. Please call 999 directly.");
            }
        } catch (err) {
            console.error(err);
            alert("Network error. Failed to send SOS. Please call 999 directly.");
        }
    });

    const btnCloseSuccess = document.getElementById('btn-close-success');
    if (btnCloseSuccess) {
        btnCloseSuccess.addEventListener('click', () => {
            document.getElementById('modal-sos-success').style.display = 'none';
        });
    }
})();
