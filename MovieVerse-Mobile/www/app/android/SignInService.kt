import android.util.Log
import okhttp3.*
import org.json.JSONObject
import java.io.IOException

object SignInService {
    private const val URL = "https://MovieVerse.com/signin"

    fun signIn(username: String, password: String, callback: (Result<User>) -> Unit) {
        val client = OkHttpClient()

        val requestBody = FormBody.Builder()
            .add("username", username)
            .add("password", password)
            .build()

        val request = Request.Builder()
            .url(URL)
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                callback(Result.failure(e))
            }

            override fun onResponse(call: Call, response: Response) {
                if (!response.isSuccessful) {
                    callback(Result.failure(IOException("Unexpected code $response")))
                    return
                }
                else if (response.body == null) {
                    callback(Result.failure(IOException("Empty response body")))
                    return
                }

                try {
                    val jsonObject = JSONObject(response.body?.string() ?: "")
                    val user = User(
                        id = jsonObject.getString("id"),
                        name = jsonObject.getString("name"),
                        email = jsonObject.getString("email"),
                        password = jsonObject.getString("password"),
                        token = jsonObject.getString("token")
                    )
                    callback(Result.success(user))
                }
                catch (e: Exception) {
                    callback(Result.failure(e))
                }
            }
        })
    }
}

data class User(
    val id: String,
    val name: String,
    val email: String,
    val password: String,
    val token: String
)
