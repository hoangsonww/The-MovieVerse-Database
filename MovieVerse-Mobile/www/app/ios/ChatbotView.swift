import SwiftUI

struct ChatbotView: View {
    @State private var userInput: String = ""
    @State private var messages: [String] = []

    var body: some View {
        VStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 10) {
                    ForEach(messages, id: \.self) { message in
                        Text(message)
                            .padding()
                            .background(Color.secondary.opacity(0.1))
                            .cornerRadius(10)
                    }
                }
            }

            HStack {
                TextField("Ask something...", text: $userInput)
                    .textFieldStyle(RoundedBorderTextFieldStyle())

                Button("Send") {
                    sendMessage()
                }
                .padding(.horizontal)
            }
            .padding()
        }
        .navigationBarTitle("MovieVerse Chatbot", displayMode: .inline)
    }

    private func sendMessage() {
        guard !userInput.isEmpty else { return }

        messages.append("You: \(userInput)")
        messages.append("Chatbot: \(userInput)")
        userInput = ""
    }

    private func fetchImageData() {
        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data else { return }
            imageData = data
        }.resume()

    private func processMessage(_ message: String) {
        messages.append("You: \(message)")
        messages.append("Chatbot: \(message)")

    private func storeMessage(_ message: String) {
        messages.append("You: \(message)")
        messages.append("Chatbot: \(message)")
}

struct ChatbotView_Previews: PreviewProvider {
    static var previews: some View {
        ChatbotView()
    }
}

struct Message: Codable {
    let text: String
    let isUserMessage: Bool
}