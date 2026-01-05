import java.util.HashMap;
import java.util.Map;

public class SettingsManager {

    // This map simulates a database or persistent storage.
    private final Map<String, String> settings = new HashMap<>();

    public SettingsManager() {
        settings.put("backgroundImage", "../../images/universe-1.png");
        settings.put("textColor", "#FFFFFF");
        settings.put("fontSize", "medium");
        settings.put("language", "en");
    }

    public void setBackgroundImage(String imageUrl) {
        settings.put("backgroundImage", imageUrl);
    }

    public String getBackgroundImage() {
        return settings.get("backgroundImage");
    }

    public void setTextColor(String colorCode) {
        settings.put("textColor", colorCode);
    }

    public String getTextColor() {
        return settings.get("textColor");
    }

    public void setFontSize(String fontSize) {
        settings.put("fontSize", fontSize);
    }

    public String getFontSize() {
        return settings.get("fontSize");
    }

    public void saveSettings() {
        Storage storage = new Storage();
        storage.saveSettings(settings);
        System.out.println("Settings saved: " + settings);
    }

}

private class Storage {

    private Map<String, String> settings = new HashMap<>();

    public void saveSettings(Map<String, String> settings) {
        settings.forEach((key, value) -> {
            storage.saveSetting(key, value);
            System.out.println("Saving setting: " + key + " with value: " + value);
        });
    }

}