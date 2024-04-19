import UIKit

class SettingsViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, UIColorPickerViewControllerDelegate {

    let tableView = UITableView()
    let backgroundImageOptions = ["Default", "Universe 1", "Universe 2", "Universe 3", "Universe 4", "Universe 5", "Universe 6", "Universe 7", "Universe 8", "Universe 9", "Universe 10", "Black", "Grey", "Blue", "Silver", "Gold", "Rose", "Pink", "Red", "Green", "Brown", "Purple", "Orange", "Light Yellow"]
    let fontSizeOptions = ["Small", "Medium", "Large"]

    override func viewDidLoad() {
        super.viewDidLoad()
        setupTableView()
        applySavedSettings()
    }

    private func setupNavigationBar() {
        self.navigationController?.navigationBar.prefersLargeTitles = true
        self.navigationController?.navigationBar.sizeToFit()
        self.navigationController?.navigationBar.layoutIfNeeded()
        self.navigationController?.navigationBar.barStyle = .black
        self.navigationController?.navigationBar.tintColor = .white
        self.navigationController?.navigationBar.barTintColor = .white
        self.navigationController?.navigationBar.backgroundColor = .white
        self.navigationController?.navigationBar.isTranslucent = false
        self.navigationController?.navigationBar.titleTextAttributes = [NSAttributedString.Key.foregroundColor: UIColor.white]
        self.navigationItem.title = "Settings"
        self.navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Reset", style: .plain, target: self, action: #selector(resetAllSettings))
        self.navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Done", style: .plain, target: self, action: #selector(dismissSettings))
    }

    private func setupNotifications() {
        NotificationCenter.default.addObserver(self, selector: #selector(reloadSettings), name: NSNotification.Name(rawValue: "reload"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(dismissSettings), name: NSNotification.Name(rawValue: "dismiss"), object: nil)
    }

    private func removeNotifications() {
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name(rawValue: "reload"), object: nil)
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name(rawValue: "dismiss"), object: nil)
    }

    @objc func reloadSettings() {
        applySavedSettings()
        tableView.reloadData()
    }

    @objc func dismissSettings() {
        self.dismiss(animated: true, completion: nil)
    }

    @objc func resetAllSettings() {
        let alert = UIAlertController(title: "Reset All Settings", message: "Are you sure you want to reset all settings?", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Yes", style: .default, handler: { action in
            UserDefaults.standard.resetAllSettingsAndReloadAndDismiss()
        }))
        alert.addAction(UIAlertAction(title: "No", style: .cancel, handler: nil))
        self.present(alert, animated: true)
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        setupNavigationBar()
        setupNotifications()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        removeNotifications()
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 50
    }

    private func setupTableView() {
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        view.addSubview(tableView)
        tableView.frame = view.bounds
    }

    func setupTableView() {
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        view.addSubview(tableView)
        tableView.frame = view.bounds
    }

    func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0:
            return backgroundImageOptions.count
        case 1:
            return 1
        case 2:
            return fontSizeOptions.count
        default:
            return 0
        }
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        switch indexPath.section {
        case 0:
            cell.textLabel?.text = backgroundImageOptions[indexPath.row]
        case 1:
            cell.textLabel?.text = "Text Color"
        case 2:
            cell.textLabel?.text = fontSizeOptions[indexPath.row]
        default:
            break
        }
        return cell
    }

    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        switch section {
        case 0:
            return "Change Background"
        case 1:
            return "Change Text Color"
        case 2:
            return "Change Font Size"
        default:
            return nil
        }
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)

        switch indexPath.section {
        case 0:
            UserDefaults.standard.set(backgroundImageOptions[indexPath.row], forKey: "backgroundImage")
        case 1:
            let colorPicker = UIColorPickerViewController()
            colorPicker.delegate = self
            self.present(colorPicker, animated: true, completion: nil)
        case 2:
            UserDefaults.standard.set(fontSizeOptions[indexPath.row], forKey: "fontSize")
        default:
            break
        }
    }

    func colorPickerViewControllerDidFinish(_ viewController: UIColorPickerViewController) {
        let selectedColor = viewController.selectedColor
        UserDefaults.standard.setColor(color: selectedColor, forKey: "textColor")
        applyTextColor()
    }

    func applySavedSettings() {
        applyBackgroundImage()
        applyTextColor()
        applyFontSize()
    }

    func applyBackgroundImage() {
        self.view.backgroundColor = UIColor(patternImage: UIImage(named: UserDefaults.standard.string(forKey: "backgroundImage") ?? "Default")!)
    }

    func applyTextColor() {
        let textColor = UserDefaults.standard.colorForKey(key: "textColor") ?? .white
        self.navigationController?.navigationBar.titleTextAttributes = [NSAttributedString.Key.foregroundColor: textColor]
        self.navigationController?.navigationBar.tintColor = textColor
        self.navigationController?.navigationBar.barTintColor = textColor
        self.navigationController?.navigationBar.backgroundColor = textColor
        self.navigationController?.navigationBar.isTranslucent = false
        self.navigationController?.navigationBar.barStyle = .black
    }

    func applyFontSize() {
        let fontSizePreference = UserDefaults.standard.string(forKey: "fontSize") ?? "Medium"
        self.navigationController?.navigationBar.titleTextAttributes = [NSAttributedString.Key.font: UIFont(name: "HelveticaNeue-\(fontSizePreference)", size: 20)!]
        self.navigationController?.navigationBar.largeTitleTextAttributes = [NSAttributedString.Key.font: UIFont(name: "HelveticaNeue-\(fontSizePreference)", size: 35)!]
        self.navigationController?.navigationBar.prefersLargeTitles = true
        self.navigationController?.navigationBar.sizeToFit()
        self.navigationController?.navigationBar.layoutIfNeeded()
    }
}

// Extension to handle saving and retrieving UIColor in UserDefaults
extension UserDefaults {

    func setColor(color: UIColor?, forKey key: String) {
        var colorData: NSData?
        if let color = color {
            colorData = try? NSKeyedArchiver.archivedData(withRootObject: color, requiringSecureCoding: false) as NSData?
        }
        set(colorData, forKey: key)
    }

    func colorForKey(key: String) -> UIColor? {
        guard let colorData = data(forKey: key) else { return nil }
        return try? NSKeyedUnarchiver.unarchivedObject(ofClass: UIColor.self, from: colorData)
    }

    func removeColorForKey(key: String) {
        removeObject(forKey: key)
    }

    func removeAllColors() {
        for key in Array(UserDefaults.standard.dictionaryRepresentation().keys) {
            if key.contains("Color") {
                removeObject(forKey: key)
            }
        }
    }

    func removeAllBackgroundImages() {
        for key in Array(UserDefaults.standard.dictionaryRepresentation().keys) {
            if key.contains("Image") {
                removeObject(forKey: key)
            }
        }
    }

    func removeAllFontSizes() {
        for key in Array(UserDefaults.standard.dictionaryRepresentation().keys) {
            if key.contains("Size") {
                removeObject(forKey: key)
            }
        }
    }

    func removeAllSettings() {
        for key in Array(UserDefaults.standard.dictionaryRepresentation().keys) {
            if key.contains("Color") || key.contains("Image") || key.contains("Size") {
                removeObject(forKey: key)
            }
        }
    }

    func resetAllSettings() {
        removeAllColors()
        removeAllBackgroundImages()
        removeAllFontSizes()
    }

    func resetAllSettingsAndReload() {
        resetAllSettings()
        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "reload"), object: nil)
    }

    func resetAllSettingsAndReloadAndDismiss() {
        resetAllSettings()
        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "reload"), object: nil)
        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "dismiss"), object: nil)
    }

    override open func value(forKey key: String) -> Any? {
        return object(forKey: key)
    }

    override open func setValue(_ value: Any?, forKey key: String) {
        set(value, forKey: key)
    }

    override open func removeObject(forKey key: String) {
        removeObject(forKey: key)
    }

    override open func dictionaryRepresentation() -> [String : Any] {
        return dictionaryRepresentation()
    }

    override open func synchronize() -> Bool {
        return synchronize()
    }

    override open func objectIsForced(forKey key: String) -> Bool {
        return objectIsForced(forKey: key)
    }

    override open func object(forKey defaultName: String) -> Any? {
        return object(forKey: defaultName)
    }

    override open func set(_ value: Any?, forKey defaultName: String) {
        set(value, forKey: defaultName)
    }

    override open func removeObject(forKey defaultName: String) {
        removeObject(forKey: defaultName)
    }

    override open func string(forKey defaultName: String) -> String? {
        return string(forKey: defaultName)
    }

    override open func array(forKey defaultName: String) -> [Any]? {
        return array(forKey: defaultName)
    }

    override open func dictionary(forKey defaultName: String) -> [String : Any]? {
        return dictionary(forKey: defaultName)
    }

    override open func data(forKey defaultName: String) -> Data? {
        return data(forKey: defaultName)
    }

    override open func stringArray(forKey defaultName: String) -> [String]? {
        return stringArray(forKey: defaultName)
    }

    override open func integer(forKey defaultName: String) -> Int {
        return integer(forKey: defaultName)
    }

}