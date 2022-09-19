export default (initialState: any) => {
  const { userPermission } = initialState
  const user = userPermission.user as UserType;

  const canSeeAdmin = user.is_staff || user.is_superuser;
  const canSeePendaftaran = user.groups.some(x => x.name == "pendaftaran")
  const canSeePemeriksaan = user.groups.some(x => x.name == "pemeriksaan_fisik") || user.groups.some(x => x.name == "pemeriksaan_mata")
  const canSeeLab = user.groups.some(x => x.name == "lab")
  const canSeeEkg = user.groups.some(x => x.name == "ekg")
  const canSeeRontgen = user.groups.some(x => x.name == "rontgen")
  const canSeeKartuKuning = user.groups.some(x => x.name == "kartu_kuning")

  return {
    canSeeAdmin: canSeeAdmin,
    canSeePendaftaran: canSeePendaftaran || canSeeAdmin,
    canSeePemeriksaan: canSeePemeriksaan || canSeeAdmin,
    canSeeLab: canSeeLab || canSeeAdmin,
    canSeeEkg: canSeeEkg || canSeeAdmin,
    canSeeRontgen: canSeeRontgen || canSeeAdmin,
    canSeeKartuKuning: canSeeKartuKuning || canSeeAdmin
  };
};
