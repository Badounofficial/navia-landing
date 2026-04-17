//
//  ContentView.swift
//  Navia App
//
//  Created by Mind Completion Body on 4/9/26.
//

import SwiftUI

struct ContentView: View {
    @State private var isBreathing = false
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "moonphase.waxing.gibbous")
                .font(.system(size: 42, weight: .light))
                .foregroundStyle(.white.opacity(0.9))
                .shadow(color: .white.opacity(0.5), radius: 20)
                .scaleEffect(isBreathing ? 1.15 : 1.0)
                .padding(.bottom, 8)

            Text("Hi, I'm Navia.")
                .font(.system(size: 32, weight: .semibold, design: .serif))
                .foregroundStyle(.white)

            Text("I'm here whenever you need me.")
                .font(.system(size: 17, weight: .regular))
                .foregroundStyle(.white.opacity(0.8))
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            LinearGradient(
                colors: [Color(red: 0.32, green: 0.28, blue: 0.77), Color(red: 0.17, green: 0.16, blue: 0.25)],
                startPoint: .top,
                endPoint: .bottom
            )
        )
        .ignoresSafeArea()
        .onAppear {
            withAnimation(.easeInOut(duration: 3).repeatForever(autoreverses: true)) {
                isBreathing = true
            }
        }
    }
}

#Preview {
    ContentView()
}
