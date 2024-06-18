package com.movieverse.app;

import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.squareup.picasso.Picasso;

public class CompanyDetailsActivity extends AppCompatActivity {

    private ImageView companyLogoImageView;
    private TextView companyNameTextView;
    private TextView companyDescriptionTextView;
    private TextView moviesProducedTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_company_details);

        companyLogoImageView = findViewById(R.id.company_logo_image);
        companyNameTextView = findViewById(R.id.company_name);
        companyDescriptionTextView = findViewById(R.id.company_description);
        moviesProducedTextView = findViewById(R.id.movies_produced);

        MovieCompany company = (MovieCompany) getIntent().getSerializableExtra("COMPANY_DETAILS");

        loadCompanyDetails(company);
    }

    private void loadCompanyDetails(MovieCompany company) {
        Picasso.get().load(company.getLogoUrl()).into(companyLogoImageView);
        companyNameTextView.setText(company.getName());
        companyDescriptionTextView.setText(company.getDescription());

        StringBuilder moviesProduced = new StringBuilder();
        for (String movie : company.getMoviesProduced()) {
            moviesProduced.append(movie).append("\n");
        }

        moviesProducedTextView.setText(moviesProduced.toString());
    }
}
