from analyzer import analyze
from classifier import load_keywords, load_severity_words
from location import load_cities

# (id, text, expected_event_type, expected_city, expected_severity, note)
TEST_CASES = [
    (1, "Waterlogging in Andheri subway, several cars stranded in knee-deep water.", "flood", "Mumbai", "high", ""),
    (2, "Yamuna overflowing, low-lying areas of Delhi inundated and families evacuated.", "flood", "Delhi", "high", ""),
    (3, "Water level rising near the Ganga ghats in Patna, officials monitoring.", "flood", "Patna", "medium", ""),
    (4, "Flash flood in Guwahati after overnight rain, roads submerged.", "flood", "Guwahati", "high", ""),
    (5, "Heavy rain in Chennai since morning, schools declared holiday.", "rainfall", "Chennai", "medium", ""),
    (6, "Light drizzle in Pune this morning, traffic normal.", "rainfall", "Pune", "low", ""),
    (7, "Very heavy rainfall in Kochi, orange alert issued by IMD.", "rainfall", "Kochi", "high", ""),
    (8, "Continuous rain in Lucknow for the last 6 hours.", "rainfall", "Lucknow", "medium", ""),
    (9, "Thunder and lightning over Bhopal, power cut in several localities.", "thunderstorm", "Bhopal", "high", ""),
    (10, "Hailstorm hit Nagpur this evening, crops damaged on the outskirts.", "thunderstorm", "Nagpur", "medium", ""),
    (11, "Lightning strike near Ranchi, two people dead.", "thunderstorm", "Ranchi", "high", ""),
    (12, "Scattered thundershowers in Bengaluru, brief and mild.", "thunderstorm", "Bengaluru", "low", ""),
    (13, "Extreme heat in Jodhpur, temperature crossed 46 degrees.", "heatwave", "Jodhpur", "high", ""),
    (14, "Heatstroke cases rising in Nagpur, hospitals on alert.", "heatwave", "Nagpur", "high", ""),
    (15, "Very hot day in Ahmedabad, sweltering afternoon.", "heatwave", "Ahmedabad", "medium", ""),
    (16, "Yellow alert for heat wave in Lucknow, stay indoors.", "heatwave", "Lucknow", "low", "Alert colour sets severity"),
    (17, "Dense fog in Delhi, zero visibility on the highway, flights delayed.", "fog", "Delhi", "high", ""),
    (18, "Light mist in Dehradun this morning, clearing by 9.", "fog", "Dehradun", "low", ""),
    (19, "Thick fog over Amritsar, trains running late.", "fog", "Amritsar", "medium", ""),
    (20, "Can't see the road in Varanasi, fog is very thick.", "fog", "Varanasi", "medium", ""),
    (21, "Severe dust storm hit Jaipur, visibility very low.", "dust_storm", "Jaipur", "high", '"visibility very low" also matches fog; dust storm should win'),
    (22, "Blowing dust in Jodhpur since afternoon, mild haze.", "dust_storm", "Jodhpur", "low", ""),
    (23, "Sandstorm over Agra, dust cloud covering the sky, many shops closed.", "dust_storm", "Agra", "medium", ""),
    (24, "Dusty winds in Delhi, dust everywhere, children coughing.", "dust_storm", "Delhi", "medium", ""),
    (25, "Gusty winds in Chandigarh, hoardings blown off near sector 17.", "strong_wind", "Chandigarh", "medium", ""),
    (26, "Gale-force winds in Visakhapatnam, trees uprooted and power cut.", "strong_wind", "Visakhapatnam", "high", ""),
    (27, "Strong winds in Ludhiana this evening, minor branch damage.", "strong_wind", "Ludhiana", "low", ""),
    (28, "High winds in Mumbai, ferry services paused.", "strong_wind", "Mumbai", "medium", ""),
    (29, "Heavy rain since midnight, roads are slippery.", "rainfall", None, "medium", "No city: leave location empty"),
    (30, "Very thick fog this morning, can't see the road.", "fog", None, "medium", "No city"),
    (31, "Lightning and thunder all night, power went out.", "thunderstorm", None, "medium", "No city"),
    (32, "Unbearable heat today, feels like 48 degrees.", "heatwave", None, "high", "No city"),
    (33, "Waterlogging near Kukatpally, Hyderabad. Roads submerged and cars stranded after heavy rain.", "flood", "Hyderabad", "high", "Pair 1: original"),
    (34, "Water logging in Kukatpally due to heavy rain, traffic stuck.", "flood", "Hyderabad", "medium", "Pair 1: duplicate of #33"),
    (35, "Thick fog over Lucknow this morning, cars crawling on the expressway.", "fog", "Lucknow", "medium", "Pair 2: original"),
    (36, "Lucknow is covered in fog, can't see the road ahead.", "fog", "Lucknow", "medium", "Pair 2: duplicate of #35"),
    (37, "Thunderstorm lashed Indore last night, lightning struck near the railway station.", "thunderstorm", "Indore", "medium", "Pair 3: original"),
    (38, "Loud thunder and lightning in Indore last night, stormy skies.", "thunderstorm", "Indore", "medium", "Pair 3: duplicate of #37"),
    (39, "Extreme heat in Jaipur today, 45 degrees at noon.", "heatwave", "Jaipur", "high", "Pair 4: original"),
    (40, "Jaipur is sweltering, unbearable heat this afternoon.", "heatwave", "Jaipur", "high", "Pair 4: duplicate of #39"),
    (41, "No flooding in Kolkata, only light rain.", "rainfall", "Kolkata", "low", 'Negation: "flooding" contains "flood"'),
    (42, "Heavy rain and roads submerged in Surat.", "flood", "Surat", "high", "Tie-break: prefer flood"),
    (43, "Low visibility due to dust in Delhi, not fog.", "dust_storm", "Delhi", "medium", "Known hard case"),
    (44, "#IMD orange alert issued for Kochi, very heavy rainfall expected tomorrow.", "rainfall", "Kochi", "high", ""),
    (45, "Snowfall in Chennai today, streets covered in snow!!!", "other", "Chennai", "medium", "Impossible claim"),
    (46, "Something bad is coming!!! Everyone run, big storm!!!", "other", None, "medium", "Vague, panic wording"),
    (47, "Flood in Mumbai. Flood in Mumbai. Flood in Mumbai. Flood in Mumbai.", "flood", "Mumbai", "medium", "Repeated text (spam)"),
    (48, "Heavy rain in Shimla right now, though the sky is clear and roads are dry.", "rainfall", "Shimla", "medium", "Contradicts itself"),
]


def run_tests():
    keywords = load_keywords()
    severity_words = load_severity_words()
    cities = load_cities()

    passed = 0
    failed = []

    for case_id, text, exp_event, exp_city, exp_severity, note in TEST_CASES:
        result = analyze(text, keywords, severity_words, cities)
        got_event = result["event_type"]
        got_city = result["city"]
        got_severity = result["severity"]

        event_ok = got_event == exp_event
        city_ok = got_city == exp_city
        severity_ok = got_severity == exp_severity

        if event_ok and city_ok and severity_ok:
            passed += 1
        else:
            failed.append({
                "id": case_id,
                "text": text,
                "expected": (exp_event, exp_city, exp_severity),
                "got": (got_event, got_city, got_severity),
                "note": note,
            })

    print(f"\n{passed}/{len(TEST_CASES)} passed\n")
    for f in failed:
        print(f"#{f['id']} FAILED — {f['text']}")
        print(f"   expected: event={f['expected'][0]}, city={f['expected'][1]}, severity={f['expected'][2]}")
        print(f"   got:      event={f['got'][0]}, city={f['got'][1]}, severity={f['got'][2]}")
        if f["note"]:
            print(f"   note: {f['note']}")
        print()


if __name__ == "__main__":
    run_tests()