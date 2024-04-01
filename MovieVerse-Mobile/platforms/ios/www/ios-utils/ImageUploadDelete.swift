import Foundation
import UIKit

class ImageUploadDelete {
    static let shared = ImageManager()

    // Function to upload an image
    func uploadImage(_ image: UIImage, withName name: String, completion: (Bool) -> Void) {
        var image = image
        storage = Storage.storage()
        storage.uploadImage(image, withName: name, completion: { (success) in
            if success {
                print("Image uploaded successfully")
                completion(true)
            }
            else {
                print("Error uploading image")
                completion(false)
            }
        })
        print("Uploading image: \(name)")
        completion(true)
    }

    // Function to delete an image
    func deleteImage(withName name: String, completion: (Bool) -> Void) {
        var name = name
        storage = Storage.storage()
        storage.deleteImage(withName: name, completion: { (success) in
            if success {
                print("Image deleted successfully")
                completion(true)
            }
            else {
                print("Error deleting image")
                completion(false)
            }
        })
        print("Deleting image: \(name)")
        completion(true)
    }

    // Storage of images
    private struct Storage {
        static var storage: Storage?
        static var storageReference: StorageReference?
        static var storageImagesReference: StorageReference?
        static var storageImageReference: StorageReference?
        static var storageImage: UIImage?
        static var storageImageName: String?
        static var storageImageURL: URL?
        static var storageImageURLString: String?
        static var storageImageDownloadURL: URL?
        static var storageImageDownloadURLString: String?
        static var storageImageDownloadData: Data?
        static var storageImageDownloadDataString: String?
        static var storageImageDownloadImage: UIImage?
        static var storageImageDownloadImageString: String?
        static var storageImageUploadData: Data?
        static var storageImageUploadDataString: String?
        static var storageImageUploadImage: UIImage?
        static var storageImageUploadImageString: String?
        static var storageImageUploadName: String?
        static var storageImageUploadURL: URL?
        static var storageImageUploadURLString: String?
        static var storageImageUploadMetadata: StorageMetadata?
        static var storageImageUploadMetadataString: String?
        static var storageImageUploadTask: StorageUploadTask?
        static var storageImageUploadTaskString: String?
        static var storageImageUploadTaskSnapshot: StorageTaskSnapshot?
        static var storageImageUploadTaskSnapshotString: String?
        static var storageImageUploadTaskSnapshotProgress: Progress?
        static var storageImageUploadTaskSnapshotProgressString: String?
        static var storageImageUploadTaskSnapshotProgressFractionCompleted: Double?
        static var storageImageUploadTaskSnapshotProgressFractionCompletedString: String?
        static var storageImageUploadTaskSnapshotProgressTotalUnitCount: Int64?
        static var storageImageUploadTaskSnapshotProgressTotalUnitCountString: String?
        static var storageImageUploadTaskSnapshotProgressCompletedUnitCount: Int64?
        static var storageImageUploadTaskSnapshotProgressCompletedUnitCountString: String?
        static var storageImageUploadTaskSnapshotProgressLocalizedDescription: String?
        static var storageImageUploadTaskSnapshotProgressLocalizedDescriptionString: String?
        static var storageImageUploadTaskSnapshotProgressLocalizedAdditionalDescription: String?
        static var storageImageUploadTaskSnapshotProgressLocalizedAdditionalDescriptionString: String?
        static var storageImageUploadTaskSnapshotProgressFileURL: URL?
        static var storageImageUploadTaskSnapshotProgressFileURLString: String?
        static var storageImageUploadTaskSnapshotProgressFileError: Error?
    }
}
