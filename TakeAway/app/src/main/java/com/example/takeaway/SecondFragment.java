package com.example.takeaway;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.fragment.NavHostFragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.takeaway.databinding.FragmentSecondBinding;

import java.util.List;

public class SecondFragment extends Fragment {

    private FragmentSecondBinding binding;
    private RecyclerView productRecyclerView;
    private List<Product> productList;

    @Override
    public View onCreateView(
            LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState
    ) {
        binding = FragmentSecondBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Obtén una lista de productos (supongamos que tienes una lista llamada productList)

        productRecyclerView = view.findViewById(R.id.productRecyclerView);
        productRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        productRecyclerView.setAdapter(new ProductAdapter(productList));
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}