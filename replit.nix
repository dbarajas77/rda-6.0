{pkgs}: {
  deps = [
    pkgs.gcc
    pkgs.pkgconfig
    pkgs.vips
    pkgs.postgresql
  ];
}
