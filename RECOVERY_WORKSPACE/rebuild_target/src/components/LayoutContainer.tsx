import React, { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link, usePathname } from "expo-router";

type LayoutContainerProps = {
  children: React.ReactNode;
  showNav?: boolean;
};

export default function LayoutContainer({
  children,
  showNav = true,
}: LayoutContainerProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Link href="/" asChild>
        <Pressable style={styles.headerBanner}>
          <Image
            source={require("../../assets/images/sentinel_transparent.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>
      </Link>

      {showNav && (
        <View style={styles.navRow}>
          <Link href="/dashboard" asChild>
            <Pressable><Text style={[styles.navItem, isActive("/dashboard") && styles.navItemActive]}>Dashboard</Text></Pressable>
          </Link>

          <Link href="/inspections" asChild>
            <Pressable><Text style={[styles.navItem, isActive("/inspections") && styles.navItemActive]}>Inspections</Text></Pressable>
          </Link>

          <Link href="/reports" asChild>
            <Pressable><Text style={[styles.navItem, isActive("/reports") && styles.navItemActive]}>Reports</Text></Pressable>
          </Link>

          <Link href="/analytics" asChild>
            <Pressable><Text style={[styles.navItem, isActive("/analytics") && styles.navItemActive]}>Analytics</Text></Pressable>
          </Link>
<View style={styles.profileWrap}>
            <Pressable
              style={styles.profileBadge}
              onPress={() => setProfileOpen(!profileOpen)}
            >
              <Text style={styles.profileText}>CM</Text>
            </Pressable>

            {profileOpen && (
              <View style={styles.profileMenu}>
                <Link href="/profile" asChild>
                  <Pressable style={styles.profileMenuItem}>
                    <Text style={styles.profileMenuText}>Edit Profile</Text>
                  </Pressable>
                </Link>

                <Link href="/settings" asChild>
                  <Pressable style={styles.profileMenuItem}>
                    <Text style={styles.profileMenuText}>Settings</Text>
                  </Pressable>
                </Link>

                <Link href="/login" asChild>
                  <Pressable style={styles.profileMenuItem}>
                    <Text style={styles.profileMenuDanger}>Sign Out</Text>
                  </Pressable>
                </Link>
              </View>
            )}
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerLinks}>
          <Link href="/about" asChild>
            <Pressable><Text style={styles.footerLink}>About</Text></Pressable>
          </Link>

          <Text style={styles.footerDivider}>|</Text>

          <Link href="/legal" asChild>
            <Pressable><Text style={styles.footerLink}>Legal</Text></Pressable>
          </Link>

          <Text style={styles.footerDivider}>|</Text>

          <Link href="/safescope" asChild>
            <Pressable><Text style={styles.footerLink}>SafeScope</Text></Pressable>
          </Link>
        </View>

        <View style={styles.footerRule} />

        <Text style={styles.footerCopyright}>
          © 2026 Sentinel Safety. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  headerBanner: {
    width: "100%",
    backgroundColor: "#102A43",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    paddingBottom: 4,
  },
  logo: {
    width: 300,
    height: 82,
  },
  navRow: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    zIndex: 10,
  },
  navItem: {
    color: "#52616F",
    fontSize: 13,
    fontWeight: "900",
  },
  navItemActive: {
    color: "#1D72B8",
    textDecorationLine: "underline",
    textDecorationColor: "#1D72B8",
  },
  profileWrap: {
    marginLeft: "auto",
    position: "relative",
    zIndex: 20,
  },
  profileBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#BFE3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
  },
  profileMenu: {
    position: "absolute",
    top: 42,
    right: 0,
    width: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  profileMenuItem: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  profileMenuText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "900",
  },
  profileMenuDanger: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "900",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 32,
  },
  footer: {
    width: "100%",
    backgroundColor: "#102A43",
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 18,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  footerLink: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  footerDivider: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
  },
  footerRule: {
    height: 1,
    backgroundColor: "#64748B",
    opacity: 0.55,
    marginBottom: 12,
  },
  footerCopyright: {
    color: "#CBD5E1",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
  },
});
